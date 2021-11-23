const fs = require('fs');
const path = require('path');
const { config } = require('@sotaoi/central/lib/config');
const { checkNonEmptyStrings, clientExists, getKeys, verifySupercredentials } = require('@sotaoi/central/lib/helper');

const removeClientRoutine = async (clientName, superusername, superpassword) => {
  if (!checkNonEmptyStrings([clientName])) {
    throw new Error('Something went wrong, inputted bad client credentials');
  }

  if (!(await clientExists(clientName))) {
    throw new Error('Client does not exist');
  }

  if (!(await verifySupercredentials(superusername, superpassword))) {
    throw new Error('Bad super credentials');
  }

  const keys = await getKeys();

  if (!(await clientExists(clientName))) {
    throw new Error('Something went wrong, client does not exist');
  }

  delete keys.clients[clientName];
  fs.rmdirSync(path.resolve(config.storagePath, clientName), { recursive: true });
  fs.writeFileSync(config.keysPath, JSON.stringify(keys, null, 2));
};

module.exports = { removeClientRoutine };
