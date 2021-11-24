const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const integrity = async () => {
  !fs.existsSync(path.resolve('./env.json')) &&
    fs.copyFileSync(path.resolve('./example.env.json'), path.resolve('./env.json'));

  if (
    fs.existsSync(path.resolve('./node_modules')) &&
    fs.existsSync(path.resolve('./node_modules/yargs')) &&
    fs.existsSync('./node_modules/@sotaoi/central')
  ) {
    return;
  }
  execSync(
    'npm install --no-optional --legacy-peer-deps --ignore-scripts --force --no-audit --no-fund  --loglevel error',
    { cwd: path.resolve('./'), stdio: 'inherit' }
  );
};

const deploymentKeys = async () => {
  // do nothing
};

const deploymentCentral = async () => {
  // do nothing
};

const install = async () => {
  execSync(`npm install --no-optional --legacy-peer-deps --force --no-audit --no-fund  --loglevel error`, {
    cwd: path.resolve('./'),
    stdio: 'inherit',
  });
};

const prepare = async () => {
  // do nothing
};

const load = async () => {
  // do nothing
};

const bootstrap = async () => {
  // do nothing
};

const config = async () => {
  // do nothing
};

const setup = async () => {
  // do nothing
};

const init = async () => {
  const { verifyGenericIntegrity } = require('@sotaoi/central/lib/helper');
  await verifyGenericIntegrity();
};

module.exports = {
  deploymentKeys,
  deploymentCentral,
  integrity,
  install,
  prepare,
  load,
  bootstrap,
  config,
  setup,
  init,
};
