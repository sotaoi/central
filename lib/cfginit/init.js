const fs = require('fs');
const path = require('path');
const { parseExtraVars } = require('@sotaoi/central/lib/cfginit/parse-vars');
const { getAppInfo } = require('@sotaoi/central/lib/cfginit/get-app-info');
const { initConfig, config, setSotaoiConfig } = require('@sotaoi/central/lib/cfginit/config');

const init = (sotaoiConfig, extraVars = {}) => {
  // this happens again below in setup
  if (
    typeof process === 'object' &&
    typeof process.versions === 'object' &&
    typeof process.versions.node !== 'undefined' &&
    typeof process.env === 'object' &&
    Object.keys(extraVars).length
  ) {
    Object.keys(extraVars).map((key) => (process.env[key] = extraVars[key]));
  }

  setSotaoiConfig(sotaoiConfig);
  const Config = sotaoiConfig;
  if (Config.isInit()) {
    return Config;
  }
  extraVars = parseExtraVars(extraVars);
  initConfig(sotaoiConfig, setup, extraVars);
  Config.setAppInfo(getAppInfo());
  return Config.setConfigFn(config);
};

const setup = (sotaoiConfig, configs, extraVars) => {
  setSotaoiConfig(sotaoiConfig);
  const Config = sotaoiConfig;
  try {
    (() => {
      if (Config.isInit()) {
        return;
      }
      const envJson = {
        ...require('@sotaoi/central/env.json'),
        // ...require('@sotaoi/central/secrets.json'),
      };
      Config.init(envJson);
    })();

    for (const [key, val] of Object.entries(Config.dumpEnvVars())) {
      if (val === null || typeof val === 'undefined' || typeof val === 'boolean') {
        continue;
      }
      if (typeof val === 'number' || typeof val === 'string') {
        process.env[key] = val.toString();
        continue;
      }
      process.env[key] = JSON.stringify(val);
    }
    for (const [key, val] of Object.entries(extraVars)) {
      process.env[key] = typeof val === 'string' ? val : undefined;
    }

    const configPath = path.resolve('./lib/config');
    fs.readdirSync(configPath).map((configFile) => {
      const extname = path.extname(configFile);
      if (extname !== '.js') {
        return;
      }
      const basename = path.basename(configFile, extname);
      const config = require(path.resolve(configPath, extname !== 'json' ? basename : configFile));
      configs[basename] = config;
    });
  } catch (err) {
    // do nothing
    console.error(err);
  }
};

module.exports = { init };
