const { parseEnvVar } = require('@sotaoi/central/lib/cfginit/parse-vars');

let appInfoParsed;

const processEnv = (envJson = null) => {
  let envVars = {};
  const processedEnvVars =
    typeof window === 'object' && typeof window.envvars === 'object'
      ? window.envvars
      : typeof process.env !== 'string'
      ? process.env
      : JSON.parse(process.env);
  for (const envVar of Object.keys(processedEnvVars)) {
    envVars[envVar] = processedEnvVars[envVar] || '';
  }
  if (typeof envJson === 'object' && envJson) {
    for (const [varName, varVal] of Object.entries(envJson)) {
      envVars[varName] = parseEnvVar(varVal);
    }
  }
  return envVars;
};

const getAppInfo = (envJson = null) => {
  if (typeof appInfoParsed !== 'undefined' && appInfoParsed) {
    return appInfoParsed;
  }

  const appInfo = require('@sotaoi/central/app-info.json');
  appInfoParsed = JSON.parse(JSON.stringify(appInfo));
  const envVars = processEnv(envJson);
  for (const key of Object.keys(appInfoParsed)) {
    for (const [varName, varVal] of Object.entries(envVars)) {
      appInfoParsed[key] =
        typeof appInfoParsed[key] === 'string'
          ? appInfoParsed[key].replace(new RegExp('%{' + varName + '}%', 'ig'), varVal || '')
          : appInfoParsed[key];
    }
  }
  return appInfoParsed;
};

module.exports = { getAppInfo };
