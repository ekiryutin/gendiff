export default class Node {
  constructor(name, type, parent = null) {
    this.name = name;
    this.type = type;
    this.parent = parent;
  }

  getLevel() {
    return this.parent === null ? 0 : this.parent.getLevel() + 1;
  }

  getIndent() {
    return this.parent !== null ? (' ').repeat(this.getLevel() * 4 - 2) : '';
  }

  showType() {
    switch (this.type) {
      case 'removed': return `${this.getIndent()}- `;
      case 'added': return `${this.getIndent()}+ `;
      case 'equal': return `${this.getIndent()}  `;
      case '': return '';
      default: throw new Error(`Unknown type ${this.type}`);
    }
  }
}
