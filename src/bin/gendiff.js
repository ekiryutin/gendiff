#!/usr/bin/env node

import program from 'commander';

program
  .version('1.0.0', '-v, --version')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<firstConfig> <secondConfig>')
  .parse(process.argv);
