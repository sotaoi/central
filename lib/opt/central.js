if (typeof process === 'object' && process && typeof process.env === 'object' && process.env) {
  const prevEmitWarningFn = process.emitWarning;
  process.emitWarning = (warning) => {
    if (warning.search('NODE_TLS_REJECT_UNAUTHORIZED') !== -1) {
      return;
    }
    prevEmitWarningFn(warning);
  };
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { fetch } = require('cross-fetch');
const FormData = require('form-data');

const encrypt = async (string, securityKey) => {
  const algorithm = 'aes-256-cbc';

  const initVector = securityKey.substr(0, 16);
  const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);

  let encryptedData = cipher.update(string, 'utf-8', 'hex');

  encryptedData += cipher.final('hex');

  return encryptedData;
};

const decrypt = async (encryptedString, securityKey) => {
  const algorithm = 'aes-256-cbc';

  const initVector = securityKey.substr(0, 16);
  const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector);

  let decryptedData = decipher.update(encryptedString, 'hex', 'utf-8');

  decryptedData += decipher.final('utf8');
  return decryptedData;
};

const central = async (targets) => {
  const centralkeysJson = require(path.resolve('./.centralkeys.json'));
  if (!centralkeysJson.securityKey) {
    throw new Error('Security key is missing');
  }
  if (
    !centralkeysJson.url ||
    !centralkeysJson.clientName ||
    !centralkeysJson.clientId ||
    !centralkeysJson.clientSecret
  ) {
    throw new Error('Central keys file is invalid');
  }
  const formData = new FormData();
  formData.append('client_name', centralkeysJson.clientName);
  formData.append('client_id', centralkeysJson.clientId);
  formData.append('client_secret', centralkeysJson.clientSecret);
  const result = await (
    await fetch(`${centralkeysJson.url}/api/central/retrieve`, {
      method: 'post',
      body: formData,
    })
  ).json();
  if (typeof result !== 'object' || !result || !result.success) {
    throw new Error('Something went wrong: ' + JSON.stringify(result, null, 2));
  }
  const env = JSON.parse(await decrypt(result.xdata.env, centralkeysJson.securityKey));
  for (const [key, fullpath] of Object.entries(targets)) {
    if (!env[key]) {
      continue;
    }
    const dirname = path.dirname(path.resolve(fullpath));
    !fs.existsSync(dirname) && fs.mkdirSync(dirname, { recursive: true });
    fs.writeFileSync(fullpath, typeof env[key] === 'object' ? JSON.stringify(env[key], null, 2) : env[key]);
  }
};

module.exports = { encrypt, decrypt, central };
