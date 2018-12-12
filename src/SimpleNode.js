import Node from './Node';

export default class SingleNode extends Node {
  constructor(name, type, value) {
    super(name, type);
    this.value = value;
  }

  toString() {
    return `${this.showType()}${this.name}: ${this.value}`;
  }
}
