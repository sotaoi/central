const fs = require('fs');
const path = require('path');
const { config } = require('@sotaoi/central/lib/config');
const { trim } = require('@sotaoi/central/lib/helper');

const removeDocRoutine = async (clientName, filepath) => {
  clientName = trim(clientName, ['/']);
  filepath = trim(filepath, ['/']);
  const fullpath = path.resolve(config.storagePath, clientName, 'docs', filepath);
  if (!fs.existsSync(fullpath)) {
    return;
  }
  fs.unlinkSync(fullpath);
};

module.exports = {
  removeDocRoutine,
};
