import path from 'path';
import fs from 'fs';
import ld from 'lodash';
import getParser from './parsers';

const compareRules = [
  {
    check: (first, second, key) => ld.has(first, key) && !ld.has(second, key),
    make: (first, second, key, { getValue }) => ({ key, type: 'removed', value: getValue(first[key]) }),
  },
  {
    check: (first, second, key) => !ld.has(first, key) && ld.has(second, key),
    make: (first, second, key, { getValue }) => ({ key, type: 'added', value: getValue(second[key]) }),
  },
  {
    check: (first, second, key) => ld.isObject(first[key]) && ld.isObject(second[key]),
    make: (first, second, key, { compareObject }) => ({ key, type: 'equal', value: compareObject(first[key], second[key]) }),
  },
  {
    check: (first, second, key) => first[key] === second[key],
    make: (first, second, key) => ({ key, type: 'equal', value: first[key] }),
  },
  {
    check: (first, second, key) => first[key] !== second[key],
    make: (first, second, key, { getValue }) => ([
      { key, type: 'removed', value: getValue(first[key]) },
      { key, type: 'added', value: getValue(second[key]) },
    ]),
  },
];

const compareObject = (firstData, secondData) => {
  const keys = ld.union(ld.keys(firstData), ld.keys(secondData)).sort();

  const compareAttribute = (key) => {
    const getValue = obj => (ld.isObject(obj) ? compareObject(obj, obj) : obj);

    const { make } = compareRules.find(({ check }) => check(firstData, secondData, key));
    return make(firstData, secondData, key, { getValue, compareObject });
  };
  const list = ld.flatten(keys.map(compareAttribute));
  return { list };
};

const formatAttributes = (list, level) => {
  const indent = (' ').repeat(level * 4 - 2);

  const formatAttribute = (item) => {
    const value = (ld.isObject(item.value) ? `{\n${formatAttributes(item.value.list, level + 1)}\n${indent}  }` : item.value);

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
