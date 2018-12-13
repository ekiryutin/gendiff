import _ from 'lodash';

const formatValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return typeof value === 'string' ? `'${value}'` : value;
};

const renderNode = (node) => {
  const renderSimpleNode = () => {
    const name = node.getFullName();
    switch (node.type) {
      case 'removed': return `Property '${name}' was removed`;
      case 'added': return `Property '${name}' was added with value: ${formatValue(node.getValue())}`;
      case 'updated': return `Property '${name}' was updated. From ${formatValue(node.getOldValue())} to ${formatValue(node.getValue())}`;
      default: return '';
    }
  };
  if (node.hasChildren()) {
    return [renderSimpleNode(), ...node.children.map(renderNode)];
  }
  return renderSimpleNode();
};

export default (ast) => {
  const output = _.flattenDeep(ast.children.map(renderNode));
  return output.filter(item => item !== '').join('\n');
};
