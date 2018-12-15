import _ from 'lodash';

const hasValue = value => value === null;

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

const buildNode = (firstData, secondData, key = null) => {
  const isRootNode = () => key === null;

  const buildChildren = (first, second) => {
    if (_.isObject(first) && _.isObject(second)) {
      const keys = _.union(_.keys(first), _.keys(second)).sort();
      return keys.map(_key => buildNode(first, second, _key));
    }
    return null;
  };

  const firstValue = _.has(firstData, key) ? firstData[key] : null;
  const secondValue = _.has(secondData, key) ? secondData[key] : null;
  const type = getType(firstValue, secondValue);
  const children = isRootNode()
    ? buildChildren(firstData, secondData)
    : buildChildren(firstValue, secondValue);

  const node = {
    name: key, type, newValue: secondValue, oldValue: firstValue,
  };
  return children ? { ...node, children } : node;
};

export default (firstData, secondData) => buildNode(firstData, secondData);
