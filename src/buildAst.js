import _ from 'lodash';

const indentStep = 4;

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

const formatValue = (value, indent) => {
  if (_.isObject(value)) {
    const nextIndent = (' ').repeat(indentStep);
    const formatObject = () => {
      const keys = _.keys(value).sort();
      return keys.map(key => `${indent}${nextIndent}  ${key}: ${value[key]}`);
    };
    return ['{', ...formatObject(), `${indent}  }`].join('\n');
  }
  return value;
};

const getType = (firstValue, secondValue) => {
  const { type } = findType.find(({ check }) => check(firstValue, secondValue));
  return type;
};

const makeRootNode = () => ({
  name: 'root',
  parent: null,

  getLevel() { return 0; },

  getFullName() { return ''; },

  showChildren() { return this.children.join('\n'); },

  toString() {
    return `{\n${this.showChildren()}\n}\n`;
  },
});

const makeBaseNode = (firstData, secondData, key, parent) => ({
  name: key,
  parent,
  type: getType(firstData[key], secondData[key]),
  value: secondData[key],
  oldValue: firstData[key],

  getLevel() { return this.parent.getLevel() + 1; },

  getIndent() { return (' ').repeat(this.getLevel() * indentStep - 2); },

  getFullName() {
    const parentName = this.parent.getFullName();
    return parentName ? `${parentName}.${this.name}` : this.name;
  },

  hasChildren() { return false; },

  getValue() { return this.value; },

  getOldValue() { return this.oldValue; },

  toString() {
    const indent = this.getIndent();
    switch (this.type) {
      case 'added':
        return `${indent}+ ${this.name}: ${formatValue(this.value, indent)}`;
      case 'removed':
        return `${indent}- ${this.name}: ${formatValue(this.oldValue, indent)}`;
      case 'updated':
        return [`${indent}- ${this.name}: ${formatValue(this.oldValue, indent)}`,
          `${indent}+ ${this.name}: ${formatValue(this.value, indent)}`].join('\n');
      default: return `${indent}  ${this.name}: ${this.value}`;
    }
  },
});

const extendNode = () => ({
  hasChildren() { return true; },

  showChildren() {
    return this.children.join('\n'); // <- .toString
  },

  toString() {
    const indent = this.getIndent();
    const startOf = () => {
      switch (this.type) {
        case 'added': return `${indent}+ `;
        case 'removed': return `${indent}- `;
        default: return `${indent}  `;
      }
    };
    return `${startOf()}${this.name}: {\n${this.showChildren()}\n${this.getIndent()}  }`;
  },
});

const buildNode = (firstData, secondData, key, parent) => {
  const getChildren = (first, second, _parent) => {
    if (_.isObject(first) && _.isObject(second)) {
      const keys = _.union(_.keys(first), _.keys(second)).sort();
      return keys.map(_key => buildNode(first, second, _key, _parent));
    }
    return null;
  };

  if (!parent) {
    const node = makeRootNode(firstData, secondData);
    return { ...node, children: getChildren(firstData, secondData, node) };
  }

  const node = makeBaseNode(firstData, secondData, key, parent);
  const children = getChildren(firstData[key], secondData[key], node);
  return children ? { ...node, children, ...extendNode() } : node;
};

export default buildNode;
