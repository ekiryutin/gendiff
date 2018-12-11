import path from 'path';
import fs from 'fs';
import ld from 'lodash';
import getParser from './parsers';

const compare = (firstData, secondData) => {
  // const keys = [...Object.keys(firstData), ...Object.keys(secondData)]; // union all
  const keys = ld.union(ld.keys(firstData), ld.keys(secondData)); // distinct union

  const compareAttribute = (key) => {
    const firstValue = firstData[key];
    const secondValue = secondData[key];
    const getType = () => {
      if (ld.has(firstData, key) && !ld.has(secondData, key)) {
        return 'removed';
      }
      if (!ld.has(firstData, key) && ld.has(secondData, key)) {
        return 'added';
      }
      return firstValue === secondValue ? 'equal' : 'different';
    };
    return {
      key, type: getType(), firstValue, secondValue,
    };
  };
  return keys.map(compareAttribute);
};

const formatOutput = (diff) => {
  const formatAttribute = (item) => {
    switch (item.type) {
      case 'removed': return `  - ${item.key}: ${item.firstValue}`;
      case 'added': return `  + ${item.key}: ${item.secondValue}`;
      case 'equal': return `    ${item.key}: ${item.firstValue}`;
      case 'different': return `  + ${item.key}: ${item.secondValue}\n  - ${item.key}: ${item.firstValue}`;
      default: return '';
    }
  };
  return ['{', ...diff.map(formatAttribute), '}'].join('\n');
};

const loadFile = (filePath) => {
  const ext = path.extname(filePath);
  const parser = getParser(ext);
  return parser(fs.readFileSync(filePath).toString());
};

export default (firstFilePath, secondFilePath) => {
  const firstData = loadFile(firstFilePath);
  const secondData = loadFile(secondFilePath);

  const diff = compare(firstData, secondData);
  return formatOutput(diff);
};
