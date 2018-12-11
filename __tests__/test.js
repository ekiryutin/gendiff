import genDiff from '../src';

const expected = `{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  - follow: false
  + verbose: true
}`;

// Нужна проверка (?) того, что "Порядок вывода не важен,
// главное чтобы в случае изменения значения одного ключа, обе строчки находились рядом.

const dir = '__tests__/__fixtures__';

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
