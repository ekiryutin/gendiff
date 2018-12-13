import _ from 'lodash';
import SimpleNode from './SimpleNode';
import ObjectNode from './ObjectNode';

export default (name, type, data, parent) => {
  const Node = _.isObject(data) ? ObjectNode : SimpleNode;
  return new Node(name, type, data, parent);
};
