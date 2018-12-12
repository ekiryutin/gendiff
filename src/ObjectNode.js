import Node from './Node';

export default class ObjectNode extends Node {
  constructor(name, type, children = []) {
    super(name, type);
    this.children = children;

    this.children.forEach(child => child.setParent(this));
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
