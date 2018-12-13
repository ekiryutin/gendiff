import fs from 'fs';
import genDiff from '../src';

const dir = '__tests__/__fixtures__';

// const loadExpectedPlain = () => fs.readFileSync(`${dir}/expected_plain.txt`).toString();
const loadExpectedTree = () => fs.readFileSync(`${dir}/expected_tree.txt`).toString();

const getActual = (firstFile, secondFile) => genDiff(`${dir}/${firstFile}`, `${dir}/${secondFile}`);

test('Difference between .json files', () => {
  const actual = getActual('before.json', 'after.json');
  const expected = loadExpectedTree();
  expect(actual).toBe(expected);
});

test('Difference between .yml files', () => {
  const actual = getActual('before.yml', 'after.yml');
  const expected = loadExpectedTree();
  expect(actual).toBe(expected);
});

test('Difference between .ini files', () => {
  const actual = getActual('before.ini', 'after.ini');
  const expected = loadExpectedTree();
  expect(actual).toBe(expected);
});

test('Difference between .json and .yml files', () => {
  const actual = getActual('before.json', 'after.yml');
  const expected = loadExpectedTree();
  expect(actual).toBe(expected);
});
