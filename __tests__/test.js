import fs from 'fs';
import genDiff from '../src';

// Нужна проверка (?) того, что "Порядок вывода не важен,
// главное чтобы в случае изменения значения одного ключа, обе строчки находились рядом.

const dir = '__tests__/__fixtures__';

const expected = fs.readFileSync(`${dir}/expected.txt`).toString();

const getActual = (firstFile, secondFile) => genDiff(`${dir}/${firstFile}`, `${dir}/${secondFile}`);

test('Difference between .json files', () => {
  const actual = getActual('before.json', 'after.json');
  expect(actual).toBe(expected);
});

test('Difference between .yml files', () => {
  const actual = getActual('before.yml', 'after.yml');
  expect(actual).toBe(expected);
});

test('Difference between .ini files', () => {
  const actual = getActual('before.ini', 'after.ini');
  expect(actual).toBe(expected);
});

test('Difference between .json and .yml files', () => {
  const actual = getActual('before.json', 'after.yml');
  expect(actual).toBe(expected);
});
