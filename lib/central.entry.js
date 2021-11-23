const { init } = require('@sotaoi/central/lib/cfginit/init');
init(require('@sotaoi/config').Config);
const { main } = require('@sotaoi/central/lib/main');

main();
