#!/usr/bin/env node

const { storeKeyRoutine } = require('@sotaoi/central/lib/routines/store-key-routine');

const main = async () => {
  try {
    const clientName = process.argv[2];
    const clientId = process.argv[3];
    const clientSecret = process.argv[4];
    const newKey = process.argv[5];

    await storeKeyRoutine(clientName, clientId, clientSecret, newKey);

    console.info('All done\n');
  } catch (err) {
    console.error('Something went wrong:');
    console.error(err);
    console.error('\n');
  }
};

main();
