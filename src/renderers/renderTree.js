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
  const indent = (' ').repeat(level * indentStep - 2);

  const renderSimpleNode = () => {
    switch (node.type) {
      case 'added':
        return `${indent}+ ${node.name}: ${formatValue(node.newValue, indent)}`;
      case 'removed':
        return `${indent}- ${node.name}: ${formatValue(node.oldValue, indent)}`;
      case 'updated':
        return [
          `${indent}- ${node.name}: ${formatValue(node.oldValue, indent)}`,
          `${indent}+ ${node.name}: ${formatValue(node.newValue, indent)}`];
      case 'equal': return `${indent}  ${node.name}: ${node.newValue}`;
      default: throw new Error(`Invalid type '${node.type}'`);
    }
  };

  const renderObjectNode = () => {
    const startOf = () => {
      switch (node.type) {
        case 'added': return `${indent}+ `;
        case 'removed': return `${indent}- `;
        case 'equal': return `${indent}  `;
        default: throw new Error(`Invalid type '${node.type}'`);
      }
    };
    const childrenRender = node.children.map(nod => renderNode(nod, level + 1));
    return [`${startOf()}${node.name}: {`, ...childrenRender, `${indent}  }`];
  };
  return node.children ? renderObjectNode() : renderSimpleNode();
};

const renderRootNode = (node) => {
  const childrenRender = node.children.map(nod => renderNode(nod, 1));
  return _.flattenDeep(['{', ...childrenRender, '}']).join('\n');
};

export default renderRootNode;
