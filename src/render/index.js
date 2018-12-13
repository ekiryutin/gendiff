import renderJson from './renderJson';
import renderPlain from './renderPlain';

const renders = {
  json: renderJson,
  plain: renderPlain,
};

export default (ast, format) => {
  const render = renders[format];
  if (!render) {
    throw new Error('Unsupported format');
  }
  return render(ast);
};
