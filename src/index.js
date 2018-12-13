import path from 'path';
import fs from 'fs';
import getParser from './parsers';
import buildAst from './buildAst';
import render from './render';

const loadData = (filePath) => {
  const ext = path.extname(filePath);
  const parseData = getParser(ext);
  return parseData(fs.readFileSync(filePath).toString());
};

export default (firstFilePath, secondFilePath, format = 'tree') => {
  const firstData = loadData(firstFilePath);
  const secondData = loadData(secondFilePath);

  const ast = buildAst(firstData, secondData);
  return render(ast, format);
};
