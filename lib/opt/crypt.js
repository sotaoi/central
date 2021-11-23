const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

// todo here: improve encryption

const encrypt = async (string, securityKey) => {
  const initVector = securityKey.substr(0, 16);
  const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);

  let encryptedData = cipher.update(string, 'utf-8', 'hex');

  encryptedData += cipher.final('hex');

  return encryptedData;
};

const decrypt = async (encryptedString, securityKey) => {
  const initVector = securityKey.substr(0, 16);
  const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector);

  let decryptedData = decipher.update(encryptedString, 'hex', 'utf-8');

  decryptedData += decipher.final('utf8');
  return decryptedData;
};

module.exports = { encrypt, decrypt };
