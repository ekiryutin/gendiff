import _ from 'lodash';
import SimpleNode from './SimpleNode';
import ObjectNode from './ObjectNode';

export default (name, type, value) => {
  const Node = _.isObject(value) ? ObjectNode : SimpleNode;
  return new Node(name, type, value);
};
