const fs = require('fs');
const path = require('path');
const { config } = require('@sotaoi/central/lib/config');
const {
  checkNonEmptyStrings,
  clientExists,
  getDefaultClientObject,
  getKeys,
  verifySupercredentials,
  safeGetClient,
} = require('@sotaoi/central/lib/helper');

const storeClientRoutine = async (clientName, clientId, clientSecret, superusername, superpassword) => {
  const ok = checkNonEmptyStrings([clientName, clientId, clientSecret, superusername, superpassword]);
  if (!ok) {
    throw new Error('Bad input');
  }

  if (!checkNonEmptyStrings([clientName, clientId, clientSecret, superusername, superpassword])) {
    throw new Error('Something went wrong, inputted bad client credentials');
  }

  if (!(await verifySupercredentials(superusername, superpassword))) {
    throw new Error('Bad super credentials');
  }

  const keys = await getKeys();

  if (await clientExists(clientName)) {
    throw new Error('Something went wrong, client already exists');
  }
  keys.clients[clientName] = {
    client_id: clientId,
    client_secret: clientSecret,
    client: await getDefaultClientObject(clientId, clientName),
  };
  fs.mkdirSync(path.resolve(config.storagePath, clientName, 'assets', clientId), { recursive: true });
  fs.mkdirSync(path.resolve(config.storagePath, clientName, 'docs'), { recursive: true });
  fs.writeFileSync(config.keysPath, JSON.stringify(keys, null, 2));

  return await safeGetClient(clientName, clientId, clientSecret);
};

module.exports = { storeClientRoutine };
