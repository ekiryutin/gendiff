import path from 'path';
import fs from 'fs';
import getParser from './parsers';
import buildAst from './ast';

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
  const ast = buildAst(data);
  return ast.toString(); // render
};
