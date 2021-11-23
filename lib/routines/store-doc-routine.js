const fs = require('fs');
const path = require('path');
const { config } = require('@sotaoi/central/lib/config');
const { trim } = require('@sotaoi/central/lib/helper');
const { Config } = require('@sotaoi/config');

const storeDocRoutine = async (clientName, docpath, doc) => {
  clientName = trim(clientName, ['/']);
  docpath = trim(docpath, ['/']);
  fs.writeFileSync(path.resolve(config.storagePath, clientName, 'docs', docpath), fs.readFileSync(doc.path));
  const appUrl = trim(Config.env('APP_URL'), ['/']);
  if (!appUrl) {
    throw new Error('Failed to store doc, no APP_URL env var');
  }
  return {
    storageUnitName: clientName,
    path: docpath,
  };
};

module.exports = {
  storeDocRoutine,
};
