import path from 'path';
import fs from 'fs';
import getParser from './parsers';
import buildAst from './buildAst';

const loadData = (filePath) => {
  const ext = path.extname(filePath);
  const parseData = getParser(ext);
  return parseData(fs.readFileSync(filePath).toString());
};

export default (firstFilePath, secondFilePath) => {
  const firstData = loadData(firstFilePath);
  const secondData = loadData(secondFilePath);

  const ast = buildAst(firstData, secondData);
  return ast.toString();
};
