import _ from 'lodash';

const keyDispatcher = [
  {
    check: (first, second, key) => !_.has(first, key) && _.has(second, key),
    make: (first, second, key) => ({ type: 'added', newValue: second[key] }),
  },
  {
    check: (first, second, key) => _.has(first, key) && !_.has(second, key),
    make: (first, second, key) => ({ type: 'removed', oldValue: first[key] }),
  },
  {
    check: (first, second, key) => key === null,
    make: (first, second, key, fn) => ({ type: 'group', children: fn(first, second) }),
  },
  {
    check: (first, second, key) => _.isObject(first[key]) && _.isObject(second[key]),
    make: (first, second, key, fn) => ({ type: 'group', children: fn(first[key], second[key]) }),
  },
  {
    check: (first, second, key) => first[key] === second[key],
    make: (first, second, key) => ({ type: 'equal', newValue: second[key], oldValue: first[key] }),
  },
  {
    check: (first, second, key) => first[key] !== second[key],
    make: (first, second, key) => ({ type: 'updated', newValue: second[key], oldValue: first[key] }),
  },
];

const buildNode = (firstData, secondData, key = null) => {
  const buildChildren = (first, second) => {
    const keys = _.union(_.keys(first), _.keys(second)).sort();
    return keys.map(_key => buildNode(first, second, _key));
  };
  const { make } = keyDispatcher.find(({ check }) => check(firstData, secondData, key));
  const node = make(firstData, secondData, key, buildChildren);
  return { name: key, ...node };
};

export default (firstData, secondData) => buildNode(firstData, secondData);
