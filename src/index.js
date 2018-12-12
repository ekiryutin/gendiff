import path from 'path';
import fs from 'fs';
import ld from 'lodash';
import getParser from './parsers';
import buildNode from './buildNode';

const compareRules = [
  {
    check: (first, second, key) => ld.has(first, key) && !ld.has(second, key),
    make: (first, second, key, { getValue }) => buildNode(key, 'removed', getValue(first[key])),
  },
  {
    check: (first, second, key) => !ld.has(first, key) && ld.has(second, key),
    make: (first, second, key, { getValue }) => buildNode(key, 'added', getValue(second[key])),
  },
  {
    check: (first, second, key) => ld.isObject(first[key]) && ld.isObject(second[key]),
    make: (first, second, key, { compareAttributes }) => buildNode(key, 'equal', compareAttributes(first[key], second[key])),
  },
  {
    check: (first, second, key) => first[key] === second[key],
    make: (first, second, key) => buildNode(key, 'equal', first[key]),
  },
  {
    check: (first, second, key) => first[key] !== second[key],
    make: (first, second, key, { getValue }) => ([
      buildNode(key, 'removed', getValue(first[key])),
      buildNode(key, 'added', getValue(second[key])),
    ]),
  },
];

const compareAttributes = (firstData, secondData) => {
  const keys = ld.union(ld.keys(firstData), ld.keys(secondData)).sort();

  const compareAttribute = (key) => {
    const getValue = obj => (ld.isObject(obj) ? compareAttributes(obj, obj) : obj);
    const { make } = compareRules.find(({ check }) => check(firstData, secondData, key));
    return make(firstData, secondData, key, { getValue, compareAttributes });
  };
  return ld.flatten(keys.map(compareAttribute));
};

const compareData = (firstData, secondData) => {
  const ast = compareAttributes(firstData, secondData);
  return buildNode('', '', ast);
};

const loadFile = (filePath) => {
  const ext = path.extname(filePath);
  const parser = getParser(ext);
  return parser(fs.readFileSync(filePath).toString());
};

export default (firstFilePath, secondFilePath) => {
  const firstData = loadFile(firstFilePath);
  const secondData = loadFile(secondFilePath);

  const ast = compareData(firstData, secondData);
  return ast.toString(); // render
};
