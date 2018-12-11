import yaml from 'js-yaml';
import ini from 'ini';

export default {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};
