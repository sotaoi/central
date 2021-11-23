const fs = require('fs');
const path = require('path');
const { config } = require('@sotaoi/central/lib/config');
const { checkNonEmptyStrings, clientExists, getKeys } = require('@sotaoi/central/lib/helper');

const removeKeyRoutine = async (clientName, clientId, clientSecret, removeKey) => {
  if (!checkNonEmptyStrings([clientName, clientId, clientSecret, removeKey])) {
    throw new Error('Something went wrong, bad input');
  }
  const keys = await getKeys();
  if (
    !(await clientExists(clientName)) ||
    keys.clients[clientName].client.keys.indexOf(removeKey) === -1 ||
    keys.clients[clientName].client_id === removeKey
  ) {
    throw new Error('Something went wrong, client or key does not exist');
  }
  if (keys.clients[clientName].client_id !== clientId || keys.clients[clientName].client_secret !== clientSecret) {
    throw new Error('Something went wrong, bad credentials');
  }
  const keyIndex = keys.clients[clientName].client.keys.indexOf(removeKey);
  keys.clients[clientName].client.keys.splice(keyIndex, 1);
  fs.writeFileSync(config.keysPath, JSON.stringify(keys, null, 2));
  Object.values(config.paths).map((itemPath) => {
    fs.unlinkSync(path.resolve(itemPath, clientName, removeKey));
  });
};

module.exports = { removeKeyRoutine };
