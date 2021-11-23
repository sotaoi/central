//

let sotaoiConfig = null;

const configs = {};

const config = (key) => {
  try {
    const keyArray = key.toLowerCase().split('.');
    const file = keyArray.shift();
    if (!file) {
      return null;
    }
    let cfg = configs[file];
    if (!cfg) {
      return null;
    }
    for (const key of keyArray) {
      cfg = cfg[key];
      if (typeof cfg === 'undefined') {
        return null;
      }
    }
    return cfg;
  } catch (err) {
    return null;
  }
};

const env = (envvar) => {
  if (typeof envvar === 'undefined' || envvar === null) {
    return null;
  }
  if (typeof envvar === 'number') {
    envvar = String(envvar);
  }
  if (typeof envvar !== 'string') {
    return null;
  }
  const { Config } = require('@sotaoi/config');
  if (!Config.isInit()) {
    console.warn('Attempting to get an env var from Config, but it is not initialized');
    return null;
  }
  return Config.env(envvar);
};

const initConfig = (sotaoiConfig, setupFn, extraVars) => {
  setupFn(sotaoiConfig, configs, extraVars);
};

const getSotaoiConfig = () => {
  return sotaoiConfig;
};

const setSotaoiConfig = (_sotaoiConfig) => {
  sotaoiConfig = _sotaoiConfig;
  return sotaoiConfig;
};

//

module.exports = { config, env, initConfig, getSotaoiConfig, setSotaoiConfig };
