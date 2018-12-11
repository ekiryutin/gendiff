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

test('Difference between .json files', () => {
  const firstFile = `${dir}/before.json`;
  const secondFile = `${dir}/after.json`;

  const actual = genDiff(firstFile, secondFile);
  expect(actual).toBe(expected);
});

test('Difference between .yml files', () => {
  const firstFile = `${dir}/before.yml`;
  const secondFile = `${dir}/after.yml`;

  const actual = genDiff(firstFile, secondFile);
  expect(actual).toBe(expected);
});

test('Difference between .json and .yml files', () => {
  const firstFile = `${dir}/before.json`;
  const secondFile = `${dir}/after.yml`;

  const actual = genDiff(firstFile, secondFile);
  expect(actual).toBe(expected);
});
