const parseEnvVar = (envVar) => {
  typeof envVar === 'number' && !isNaN(envVar) && envVar.toString();
  if (typeof envVar === 'string') {
    return envVar;
  }
  if (envVar === true) {
    return '1';
  }
  if (!envVar) {
    return '';
  }
  if (typeof envVar === 'object') {
    return JSON.stringify(envVar);
  }
  return '';
};

const parseExtraVars = (extraVars = {}) => {
  (typeof extraVars !== 'object' || !extraVars) && (extraVars = {});
  Object.keys(extraVars).map((key) => {
    extraVars[key] = parseEnvVar(extraVars[key]);
  });
  return extraVars;
};

module.exports = { parseEnvVar, parseExtraVars };
