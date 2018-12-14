import fs from 'fs';
import genDiff from '../src';

const dir = '__tests__/__fixtures__';

const loadExpected = filename => fs.readFileSync(`${dir}/${filename}`).toString().trim();

const tests = [
  {
    extension: 'json', format: 'tree',
  },
  {
    extension: 'yml', format: 'tree',
  },
  {
    extension: 'ini', format: 'tree',
  },
  {
    extension: 'json', format: 'plain',
  },
];


tests.forEach((t) => {
  test(`Compare .${t.extension} files -> ${t.format}`, () => {
    const actual = genDiff(`${dir}/before.${t.extension}`, `${dir}/after.${t.extension}`, t.format);
    const expected = loadExpected(`expected_${t.format}.txt`);
    expect(actual).toBe(expected);
  });
});
