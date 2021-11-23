#!/usr/bin/env node

const { removeKeyRoutine } = require('@sotaoi/central/lib/routines/remove-key-routine');

const main = async () => {
  try {
    const clientName = process.argv[2];
    const clientId = process.argv[3];
    const clientSecret = process.argv[4];
    const removedKey = process.argv[5];

    await removeKeyRoutine(clientName, clientId, clientSecret, removedKey);

    console.info('All done\n');
  } catch (err) {
    console.error('Something went wrong:');
    console.error(err);
    console.error('\n');
  }
};

main();
