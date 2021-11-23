const { getSotaoiConfig } = require('@sotaoi/central/lib/cfginit/config');

module.exports = {
  name: getSotaoiConfig().env('APP_NAME'),
  url: getSotaoiConfig().env('APP_URL'),
};
