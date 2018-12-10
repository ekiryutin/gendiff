import fs from 'fs';
import ld from 'lodash';

const compare = (firstData, secondData) => {
  // const keys = [...Object.keys(firstData), ...Object.keys(secondData)]; // union all
  const keys = ld.union(ld.keys(firstData), ld.keys(secondData)); // distinct union

  const compareAttribute = (key) => {
    const getType = () => {
      if (ld.has(firstData, key) && !ld.has(secondData, key)) {
        return 'first';
      }
      if (!ld.has(firstData, key) && ld.has(secondData, key)) {
        return 'second';
      }
      return firstData[key] === secondData[key] ? 'equal' : 'different';
    };
    return {
      key, type: getType(), firstValue: firstData[key], secondValue: secondData[key],
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

export default (firstFilePath, secondFilePath) => {
  const firstData = JSON.parse(fs.readFileSync(firstFilePath));
  const secondData = JSON.parse(fs.readFileSync(secondFilePath));

  const diff = compare(firstData, secondData);
  return formatOutput(diff);
};
