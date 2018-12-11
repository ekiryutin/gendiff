import fs from 'fs';
import genDiff from '../src';

const dir = '__tests__/__fixtures__';

const expectedPlain = fs.readFileSync(`${dir}/expected_plain.txt`).toString();
const expectedTree = fs.readFileSync(`${dir}/expected_tree.txt`).toString();

const getActual = (firstFile, secondFile) => genDiff(`${dir}/${firstFile}`, `${dir}/${secondFile}`);

test('Difference between .json files', () => {
  const actual = getActual('before.json', 'after.json');
  expect(actual).toBe(expectedTree);
});

test('Difference between .yml files', () => {
  const actual = getActual('before.yml', 'after.yml');
  expect(actual).toBe(expectedTree);
});

test('Difference between .ini files', () => {
  const actual = getActual('before.ini', 'after.ini');
  expect(actual).toBe(expectedPlain);
});

test('Difference between .json and .yml files', () => {
  const actual = getActual('before.json', 'after.yml');
  expect(actual).toBe(expectedTree);
});
