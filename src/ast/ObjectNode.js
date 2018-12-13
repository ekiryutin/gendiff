import compare from './compare';
import Node from './Node';

export default class ObjectNode extends Node {
  constructor(name, type, data, parent) {
    super(name, type, parent);
    this.children = compare(data, this);
  }

  showChildren() {
    if (this.children) {
      // return this.children.map(item => item.toString()).join('\n');
      return this.children.join('\n');
    }
    return '';
  }

  toString() {
    if (this.parent === null) { // root
      return `{\n${this.showChildren()}\n}\n`;
    }
    return `${this.showType()}${this.name}: {\n${this.showChildren()}\n${this.getIndent()}  }`;
  }
}
