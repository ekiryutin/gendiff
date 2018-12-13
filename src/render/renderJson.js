
const replacer = (key, value) => {
  if (key === 'parent') {
    return undefined;
  }
  return value;
};

export default ast => JSON.stringify(ast, replacer);
