#!/usr/bin/env node

const { sslSnakeOilRoutine } = require('@sotaoi/central/lib/console/commands/routines/ssl-snakeoil-routine');

const main = async () => {
  sslSnakeOilRoutine(false);
};

main();
