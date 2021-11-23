const fs = require('fs');
const path = require('path');
const { config } = require('@sotaoi/central/lib/config');
const { trim } = require('@sotaoi/central/lib/helper');

const retrieveDocRoutine = (clientName, docpath) => {
  const fullpath = path.resolve(config.storagePath, trim(clientName, ['/']), 'docs', trim(docpath, ['/']));
  if (!fs.existsSync(fullpath)) {
    return null;
  }
  return fullpath;
};

module.exports = { retrieveDocRoutine };
