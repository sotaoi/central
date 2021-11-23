#!/usr/bin/env node

const { storeClientRoutine } = require('@sotaoi/central/lib/routines/store-client-routine');

const main = async () => {
  try {
    const clientName = process.argv[2];
    const clientId = process.argv[3];
    const clientSecret = process.argv[4];
    const superusername = process.argv[5];
    const superpassword = process.argv[6];

    await storeClientRoutine(clientName, clientId, clientSecret, superusername, superpassword);

    console.info('All done\n');
  } catch (err) {
    console.error(err);
  }
};

main();
