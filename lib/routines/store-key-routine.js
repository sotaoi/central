const fs = require('fs');
const path = require('path');
const { config } = require('@sotaoi/central/lib/config');
const { checkNonEmptyStrings, clientExists, getKeys } = require('@sotaoi/central/lib/helper');

const storeKeyRoutine = async (clientName, clientId, clientSecret, newKey) => {
  if (!checkNonEmptyStrings([clientName, clientId, clientSecret, newKey])) {
    throw new Error('Something went wrong, bad input');
  }

  if (!(await clientExists(clientName))) {
    console.error('Client does not exist\n');
    return;
  }

  const keys = await getKeys();
  if (
    !(await clientExists(clientName)) ||
    keys.clients[clientName].client.keys.indexOf(newKey) !== -1 ||
    keys.clients[clientName].client_id === newKey
  ) {
    throw new Error('Something went wrong, client does not exist or key is already present');
  }
  if (keys.clients[clientName].client_id !== clientId || keys.clients[clientName].client_secret !== clientSecret) {
    throw new Error('Something went wrong, bad credentials');
  }
  keys.clients[clientName].client.keys.push(newKey);
  fs.writeFileSync(config.keysPath, JSON.stringify(keys, null, 2));
  fs.symlinkSync(
    path.resolve(config.storagePath, clientName, 'assets', clientId),
    path.resolve(config.storagePath, clientName, 'assets', newKey),
  );
};

module.exports = { storeKeyRoutine };
