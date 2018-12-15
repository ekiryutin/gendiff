import _ from 'lodash';

const formatValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return typeof value === 'string' ? `'${value}'` : value;
};

const renderNode = (node, parentName = '') => {
  const fullName = (parentName.length === 0 ? node.name : `${parentName}.${node.name}`);
  switch (node.type) {
    case 'removed': return `Property '${fullName}' was removed`;
    case 'added': return `Property '${fullName}' was added with value: ${formatValue(node.newValue)}`;
    case 'updated': return `Property '${fullName}' was updated. From ${formatValue(node.oldValue)} to ${formatValue(node.newValue)}`;
    case 'equal': return '';
    case 'group': return node.children.map(nod => renderNode(nod, fullName));
    default: throw new Error(`Invalid type '${node.type}'`);
  }
};

export default (ast) => {
  const output = _.flattenDeep(ast.children.map(node => renderNode(node)));
  return output.filter(item => item !== '').join('\n');
};
