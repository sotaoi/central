const fs = require('fs');
const path = require('path');
const commandExistsSync = require('command-exists').sync;
const { execSync } = require('child_process');

const sslSnakeOilRoutine = async (force) => {
  if (typeof force !== 'boolean') {
    throw new Error('Bad sslSnakeOilRoutine argument');
  }

  if (!commandExistsSync('openssl')) {
    console.error('No "openssl" binary detected, this command runs only with OpenSSL, exiting...');
    return;
  }

  let certsDirEmpty = true;

  const envJson = require('../../../../env.json');

  const certsDir = path.resolve('./certs');

  if (!fs.existsSync(certsDir)) {
    console.error('Pocket certs dir does not exist');
    return;
  }

  if (force) {
    fs.readdirSync(certsDir).map((item) => {
      if (item === '.gitignore' || fs.lstatSync(path.resolve(certsDir, item)).isDirectory()) {
        return;
      }
      fs.unlinkSync(path.resolve(certsDir, item));
    });
  }

  for (const item of fs.readdirSync(certsDir)) {
    if (item.charAt(0) === '.') {
      continue;
    }
    if (fs.lstatSync(path.resolve(certsDir, item)).isFile()) {
      certsDirEmpty = false;
      break;
    }
  }
  if (!certsDirEmpty) {
    console.error('Pocket certs dir is not empty, exiting...');
    return;
  }

  execSync(
    `openssl req -new -x509 -nodes -out ./cert.pem -keyout ./privkey.pem -days 365 -subj '/CN=${envJson.APP_URL.replace(
      'https://',
      '',
    ).replace('http://', '')}'`,
    {
      cwd: path.resolve('./certs'),
      stdio: 'inherit',
    },
  );
  fs.copyFileSync(path.resolve('./certs/cert.pem'), path.resolve('./certs/bundle.pem'));
  fs.copyFileSync(path.resolve('./certs/cert.pem'), path.resolve('./certs/chain.pem'));
  fs.copyFileSync(path.resolve('./certs/cert.pem'), path.resolve('./certs/fullchain.pem'));
};

module.exports = { sslSnakeOilRoutine };
