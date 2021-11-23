const fs = require('fs');
const path = require('path');
const { config } = require('@sotaoi/central/lib/config');
const { trim } = require('@sotaoi/central/lib/helper');

const checkDocRoutine = (clientName, docpath) => {
  const fullpath = path.resolve(config.storagePath, trim(clientName, ['/']), 'docs', trim(docpath, ['/']));
  return !!fs.existsSync(fullpath);
};

module.exports = { checkDocRoutine };
