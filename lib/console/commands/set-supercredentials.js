#!/usr/bin/env node

const {
  checkNonEmptyStrings,
  checkSupercredentialsAreSet,
  setSupercredentials,
} = require('@sotaoi/central/lib/helper');

const main = async () => {
  try {
    if (process.argv.length < 4) {
      console.error('Bad input\n');
      return;
    }

    const username = process.argv[2];
    const password = process.argv[3];

    const ok = checkNonEmptyStrings([username, password]);
    if (!ok) {
      console.error('Bad input\n');
      return;
    }

    if (await checkSupercredentialsAreSet()) {
      console.error('Super credentials are already set\n');
      return;
    }

    await setSupercredentials(username, password);

    console.info('All done\n');
  } catch (err) {
    console.error('Something went wrong:');
    console.error(err);
    console.error('\n');
  }
};

main();
