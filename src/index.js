import path from 'path';
import fs from 'fs';
import ld from 'lodash';
import parsers from './parsers';

const compare = (firstData, secondData) => {
  // const keys = [...Object.keys(firstData), ...Object.keys(secondData)]; // union all
  const keys = ld.union(ld.keys(firstData), ld.keys(secondData)); // distinct union

  const compareAttribute = (key) => {
    const firstValue = firstData[key];
    const secondValue = secondData[key];
    const getType = () => {
      if (ld.has(firstData, key) && !ld.has(secondData, key)) {
        return 'first';
      }
      if (!ld.has(firstData, key) && ld.has(secondData, key)) {
        return 'second';
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
      case 'first': return `  - ${item.key}: ${item.firstValue}`;
      case 'second': return `  + ${item.key}: ${item.secondValue}`;
      case 'equal': return `    ${item.key}: ${item.firstValue}`;
      default: return `  + ${item.key}: ${item.secondValue}\n  - ${item.key}: ${item.firstValue}`;
    }
  };
  return ['{', ...diff.map(formatAttribute), '}'].join('\n');
};

const loadFile = (filePath) => {
  const ext = path.extname(filePath);
  return parsers[ext](fs.readFileSync(filePath));
};

export default (firstFilePath, secondFilePath) => {
  const firstData = loadFile(firstFilePath);
  const secondData = loadFile(secondFilePath);

  const diff = compare(firstData, secondData);
  return formatOutput(diff);
};
