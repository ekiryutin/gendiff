import path from 'path';
import fs from 'fs';
import ld from 'lodash';
import getParser from './parsers';

const isObject = obj => typeof obj === 'object';

const compareObject = (firstData, secondData) => {
  const keys = ld.union(ld.keys(firstData), ld.keys(secondData)).sort();

  const compareAttribute = (key) => {
    const getValue = obj => (isObject(obj) ? compareObject(obj, obj) : obj);

    const mapper = [
      {
        check: () => ld.has(firstData, key) && !ld.has(secondData, key),
        make: () => ({ key, type: 'removed', value: getValue(firstData[key]) }),
      },
      {
        check: () => !ld.has(firstData, key) && ld.has(secondData, key),
        make: () => ({ key, type: 'added', value: getValue(secondData[key]) }),
      },
      {
        check: () => isObject(firstData[key]) && isObject(secondData[key]),
        make: () => ({ key, type: 'equal', value: compareObject(firstData[key], secondData[key]) }),
      },
      {
        check: () => firstData[key] === secondData[key],
        make: () => ({ key, type: 'equal', value: firstData[key] }),
      },
      {
        check: () => firstData[key] !== secondData[key],
        make: () => ([
          { key, type: 'removed', value: getValue(firstData[key]) },
          { key, type: 'added', value: getValue(secondData[key]) },
        ]),
      },
    ];

    const { make } = mapper.find(({ check }) => check(firstData, secondData, key));
    return make(firstData, secondData, key);
  };
  const list = ld.flatten(keys.map(compareAttribute));
  return { list };
};

const formatAttributes = (list, level) => {
  const indent = (' ').repeat(level * 4 - 2);

  const formatAttribute = (item) => {
    const formatValue = value => (isObject(value) ? `{\n${formatAttributes(value.list, level + 1)}\n${indent}  }` : value);
    const value = formatValue(item.value);

    switch (item.type) {
      case 'removed': return `${indent}- ${item.key}: ${value}`;
      case 'added': return `${indent}+ ${item.key}: ${value}`;
      case 'equal': return `${indent}  ${item.key}: ${value}`;
      default: throw new Error(`Unknown type ${item.type}`);
    }
  };
  return list.map(formatAttribute).join('\n');
};

const formatOutput = ast => `{\n${formatAttributes(ast.list, 1)}\n}\n`;

const loadFile = (filePath) => {
  const ext = path.extname(filePath);
  const parser = getParser(ext);
  return parser(fs.readFileSync(filePath).toString());
};

export default (firstFilePath, secondFilePath) => {
  const firstData = loadFile(firstFilePath);
  const secondData = loadFile(secondFilePath);

  const ast = compareObject(firstData, secondData);
  return formatOutput(ast);
};
