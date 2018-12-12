import path from 'path';
import fs from 'fs';
import getParser from './parsers';
import buildNode from './buildNode';

const loadFile = (filePath) => {
  const ext = path.extname(filePath);
  const parser = getParser(ext);
  return parser(fs.readFileSync(filePath).toString());
};

export default (firstFilePath, secondFilePath) => {
  const data = {
    first: loadFile(firstFilePath),
    second: loadFile(secondFilePath),
  };
  const ast = buildNode('', '', data);
  return ast.toString(); // render
};
