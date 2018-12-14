import _ from 'lodash';

const hasValue = value => value === undefined;

const findType = [
  {
    check: (first, second) => hasValue(first) && !hasValue(second),
    type: 'added',
  },
  {
    check: (first, second) => !hasValue(first) && hasValue(second),
    type: 'removed',
  },
  {
    check: (first, second) => _.isObject(first) && _.isObject(second),
    type: 'equal',
  },
  {
    check: (first, second) => first === second,
    type: 'equal',
  },
  {
    check: (first, second) => first !== second,
    type: 'updated',
  },
];

const getType = (firstValue, secondValue) => {
  const { type } = findType.find(({ check }) => check(firstValue, secondValue));
  return type;
};

const makeBaseNode = (firstData, secondData, key) => ({
  name: key,
  type: getType(firstData[key], secondData[key]),
  value: secondData[key],
  oldValue: firstData[key],
});

const buildNode = (firstData, secondData, key, root = false) => {
  const buildChildren = (first, second) => {
    if (_.isObject(first) && _.isObject(second)) {
      const keys = _.union(_.keys(first), _.keys(second)).sort();
      return keys.map(_key => buildNode(first, second, _key));
    }
    return null;
  };

  if (root) {
    return { children: buildChildren(firstData, secondData) };
  }

  const node = makeBaseNode(firstData, secondData, key);
  const children = buildChildren(firstData[key], secondData[key], node);
  return children ? { ...node, children } : node;
};

export default (firstData, secondData) => buildNode(firstData, secondData, '', true);
