#!/usr/bin/env node

const { removeClientRoutine } = require('@sotaoi/central/lib/routines/remove-client-routine');

const main = async () => {
  try {
    const clientName = process.argv[2];
    const superusername = process.argv[3];
    const superpassword = process.argv[4];

    await removeClientRoutine(clientName, superusername, superpassword);

    console.info('All done\n');
  } catch (err) {
    console.error('Something went wrong:');
    console.error(err);
    console.error('\n');
  }
};

main();
