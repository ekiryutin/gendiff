import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

export default (ext) => {
  const parser = parsers[ext];
  if (!parser) {
    throw new Error(('Unsupported extension'));
  }
  return parser;
};
