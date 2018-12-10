#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import genDiff from '..';

const getFullPath = pathname => path.resolve(process.cwd(), pathname);

program
  .version('1.0.0', '-v, --version')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const result = genDiff(getFullPath(firstConfig), getFullPath(secondConfig));
    console.log(result);
  })
  .parse(process.argv);
