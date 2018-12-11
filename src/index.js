import path from 'path';
import fs from 'fs';
import ld from 'lodash';
import getParser from './parsers';

const isObject = obj => typeof obj === 'object';

const compareObject = (firstData, secondData) => {
  const keys = ld.union(ld.keys(firstData), ld.keys(secondData)).sort();

  const compareAttribute = (key) => {
    const hasFirst = ld.has(firstData, key);
    const hasSecond = ld.has(secondData, key);
    const firstValue = firstData[key];
    const secondValue = secondData[key];

    const getValue = obj => (isObject(obj) ? compareObject(obj, obj) : obj);

    if (hasFirst && !hasSecond) {
      return { key, type: 'removed', value: getValue(firstValue) };
    }
    if (!hasFirst && hasSecond) {
      return { key, type: 'added', value: getValue(secondValue) };
    }
    if (isObject(firstValue) && isObject(secondValue)) { // уточнить
      return { key, type: 'equal', value: compareObject(firstValue, secondValue) };
    }
    if (firstValue === secondValue) {
      return { key, type: 'equal', value: firstValue };
    }
    // 'changed'
    return [
      { key, type: 'removed', value: getValue(firstValue) },
      { key, type: 'added', value: getValue(secondValue) },
    ];
  };
  const list = ld.flatten(keys.map(compareAttribute));
  return { list };
};

const formatAttributes = (list, level) => {
  const indent = (' ').repeat(level * 4 - 2);

  const formatAttribute = (item) => {
    const formatValue = (value) => {
      if (isObject(value)) {
        return `{\n${formatAttributes(value.list, level + 1)}\n${indent}  }`;
      }
      return value;
    };
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
