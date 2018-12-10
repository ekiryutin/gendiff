import genDiff from '../src';

const expected = `{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  - follow: false
  + verbose: true
}`;

test('Difference between .json files', () => {
  const dir = '__tests__/__fixtures__';
  const firstFile = `${dir}/before.json`;
  const secondFile = `${dir}/after.json`;

  const actual = genDiff(firstFile, secondFile);
  expect(actual).toBe(expected);
});
