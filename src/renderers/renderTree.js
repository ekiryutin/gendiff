import _ from 'lodash';

const indentStep = 4;

const formatValue = (value, indent) => {
  if (!_.isObject(value)) return value;

  const nextIndent = (' ').repeat(indentStep);
  const formatObject = () => {
    const keys = _.keys(value).sort();
    return keys.map(key => `${indent}${nextIndent}  ${key}: ${value[key]}`);
  };
  return ['{', ...formatObject(), `${indent}  }`].join('\n');
};

const renderNode = (node, level) => {
  const renderChildren = () => node.children.map(nod => renderNode(nod, level + 1));
  const indent = (' ').repeat(level * indentStep - 2);
  switch (node.type) {
    case 'added':
      return `${indent}+ ${node.name}: ${formatValue(node.newValue, indent)}`;
    case 'removed':
      return `${indent}- ${node.name}: ${formatValue(node.oldValue, indent)}`;
    case 'updated':
      return [
        `${indent}- ${node.name}: ${formatValue(node.oldValue, indent)}`,
        `${indent}+ ${node.name}: ${formatValue(node.newValue, indent)}`];
    case 'equal':
      return `${indent}  ${node.name}: ${node.newValue}`;
    case 'group':
      return [`${indent}  ${node.name}: {`, ...renderChildren(), `${indent}  }`];

    default: throw new Error(`Invalid type '${node.type}'`);
  }
};

export default (node) => {
  const childrenRender = node.children.map(nod => renderNode(nod, 1));
  return _.flattenDeep(['{', ...childrenRender, '}']).join('\n');
};
