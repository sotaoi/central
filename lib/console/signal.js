#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');

const main = async () => {
  const signalCore = require('./core');
  await signalCore.integrity();

  const { SignalContract } = require('@sotaoi/signal');

  class Signal extends SignalContract {
    //
  }

  new Signal(require('../../package.json'), {
    ...signalCore,
  })
    .console()
    .command('dev:start', 'Start servers', null, () => {
      execSync(`npx nodemon --config ./cfg-nodemon-central.json`, {
        cwd: path.resolve('./'),
        stdio: 'inherit',
      });
    })
    .command('set:supercredentials', null, null, () => {
      execSync(`node ./lib/console/commands/set-supercredentials`, { cwd: path.resolve('./'), stdio: 'inherit' });
    })
    .command('store:client', null, null, () => {
      execSync(`node ./lib/console/commands/store-client`, { cwd: path.resolve('./'), stdio: 'inherit' });
    })
    .command('remove:client', null, null, () => {
      execSync(`node ./lib/console/commands/remove-client`, { cwd: path.resolve('./'), stdio: 'inherit' });
    })
    .command('store:key', null, null, () => {
      execSync(`node ./lib/console/commands/store-key`, { cwd: path.resolve('./'), stdio: 'inherit' });
    })
    .command('remove:key', null, null, () => {
      execSync(`node ./lib/console/commands/remove-key`, { cwd: path.resolve('./'), stdio: 'inherit' });
    })
    .command('ssl:greenlock', 'Greenlock SSL certificates', null, () => {
      // execSync(`node ./lib/console/commands/ssl/ssl-greenlock`, { cwd: path.resolve('./'), stdio: 'inherit' });
    })
    .command('ssl:snakeoil', 'Snakeoil SSL certificates', null, () => {
      execSync(`node ./lib/console/commands/ssl/ssl-snakeoil`, { cwd: path.resolve('./'), stdio: 'inherit' });
    })
    .command('ssl:snakeoil:force', 'Force snakeoil SSL certificates', null, () => {
      execSync(`node ./lib/console/commands/ssl/ssl-snakeoil-force`, { cwd: path.resolve('./'), stdio: 'inherit' });
    })
    .command('tail', 'Tail log files', null, () => {
      execSync(`tail -f ./logs/*.log`, { cwd: path.resolve('./'), stdio: 'inherit' });
    })
    .run();

  //
};

main();
