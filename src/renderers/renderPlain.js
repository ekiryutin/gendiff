import _ from 'lodash';

const formatValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return typeof value === 'string' ? `'${value}'` : value;
};

const renderNode = (node, parentName = '') => {
  const getFullName = () => (parentName.length === 0 ? node.name : `${parentName}.${node.name}`);

  const renderSimpleNode = () => {
    const name = getFullName(node);
    switch (node.type) {
      case 'removed': return `Property '${name}' was removed`;
      case 'added': return `Property '${name}' was added with value: ${formatValue(node.newValue)}`;
      case 'updated': return `Property '${name}' was updated. From ${formatValue(node.oldValue)} to ${formatValue(node.newValue)}`;
      default: return '';
    }
  };
  if (node.children) {
    return [renderSimpleNode(), ...node.children.map(nod => renderNode(nod, getFullName()))];
  }
  return renderSimpleNode();
};

export default (ast) => {
  const output = _.flattenDeep(ast.children.map(node => renderNode(node)));
  return output.filter(item => item !== '').join('\n');
};
