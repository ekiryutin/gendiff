import _ from 'lodash';
import buildNode from './buildNode';

const getValue = obj => (_.isObject(obj) ? { first: obj, second: obj } : obj);

const compareRules = [
  {
    check: (key, first, second) => _.has(first, key) && !_.has(second, key),
    build: (key, first, second, parent) => buildNode(key, 'removed', getValue(first[key]), parent),
  },
  {
    check: (key, first, second) => !_.has(first, key) && _.has(second, key),
    build: (key, first, second, parent) => buildNode(key, 'added', getValue(second[key]), parent),
  },
  {
    check: (key, first, second) => _.isObject(first[key]) && _.isObject(second[key]),
    build: (key, first, second, parent) => buildNode(key, 'equal', { first: first[key], second: second[key] }, parent),
  },
  {
    check: (key, first, second) => first[key] === second[key],
    build: (key, first, second, parent) => buildNode(key, 'equal', first[key], parent),
  },
  {
    check: (key, first, second) => first[key] !== second[key],
    build: (key, first, second, parent) => ([
      buildNode(key, 'removed', getValue(first[key]), parent),
      buildNode(key, 'added', getValue(second[key]), parent),
    ]),
  },
];

const compare = (data, parent) => {
  const keys = _.union(_.keys(data.first), _.keys(data.second)).sort();
  const compareAttribute = (key) => {
    const { build } = compareRules.find(({ check }) => check(key, data.first, data.second));
    return build(key, data.first, data.second, parent);
  };
  return _.flatten(keys.map(compareAttribute));
};

export default compare;
