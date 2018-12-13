import fs from 'fs';
import genDiff from '../src';

const dir = '__tests__/__fixtures__';

const loadExpected = filename => fs.readFileSync(`${dir}/${filename}`).toString().trim();

const tests = [
  {
    description: 'Compare .json files -> tree',
    firstFile: 'before.json',
    secondFile: 'after.json',
    expectedFile: 'expected_tree.txt',
  },
  {
    description: 'Compare .yml files -> tree',
    firstFile: 'before.yml',
    secondFile: 'after.yml',
    expectedFile: 'expected_tree.txt',
  },
  {
    description: 'Compare .ini files -> tree',
    firstFile: 'before.yml',
    secondFile: 'after.yml',
    expectedFile: 'expected_tree.txt',
  },
  {
    description: 'Compare .json files -> plain',
    firstFile: 'before.json',
    secondFile: 'after.json',
    expectedFile: 'expected_plain.txt',
    format: 'plain',
  },
];


tests.forEach((t) => {
  test(t.description, () => {
    const actual = genDiff(`${dir}/${t.firstFile}`, `${dir}/${t.secondFile}`, t.format);
    const expected = loadExpected(t.expectedFile);
    expect(actual).toBe(expected);
  });
});

/*
// test json ?
test('Difference between .json and .yml files', () => {
  const actual = getActual('before.json', 'after.yml');
  const expected = loadExpected('expected_tree.txt');
  expect(actual).toBe(expected);
});
*/
