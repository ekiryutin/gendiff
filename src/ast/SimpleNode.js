import Node from './Node';

export default class SingleNode extends Node {
  constructor(name, type, data, parent) {
    super(name, type, parent);
    this.value = data;
  }

  toString() {
    return `${this.showType()}${this.name}: ${this.value}`;
  }
}
