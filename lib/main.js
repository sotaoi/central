// MAIN START

const path = require('path');
const express = require('express');
const https = require('https');
const fs = require('fs');
//
const { verifyGenericIntegrity } = require('@sotaoi/central/lib/helper');
const { Config } = require('@sotaoi/config');
//
const { middleware } = require('@sotaoi/central/lib/opt/middleware');
const { routes } = require('@sotaoi/central/lib/opt/routes');

const main = async () => {
  //

  const keyPath = path.resolve(Config.env('SSL_KEY') || '');
  const certPath = path.resolve(Config.env('SSL_CERT') || '');
  const chainPath = path.resolve(Config.env('SSL_CA') || '');

  const certs = () => ({
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
    ca: fs.readFileSync(chainPath),
  });

  const getTimestamp = () => {
    return new Date().toISOString().substr(0, 19).replace('T', ' ');
  };

  const startServer = async (app) => {
    await verifyGenericIntegrity();

    // const tls = require('tls');
    // https
    //   .createServer(
    //     {
    //       SNICallback: async (currentDomain, cb) => {
    //         const secureContext = tls.createSecureContext(
    //           await (async () => {
    //             // other sync / async procedures can go here
    //             return {
    //               ...certs(),
    //             };
    //           })()
    //         );
    //         if (cb) {
    //           cb(null, secureContext);
    //           return;
    //         }
    //         return secureContext;
    //       },
    //       rejectUnauthorized: false,
    //     },
    //     app
    //   )
    //   .listen(Config.env('PORT'));
    // console.info(`[${getTimestamp()}] Server running on port ${Config.env('PORT')}`);

    https
      .createServer(
        {
          ...certs(),
          rejectUnauthorized: false,
        },
        app
      )
      .listen(Config.env('PORT'));
    console.info(`[${getTimestamp()}] Server running on port ${Config.env('PORT')}`);

    // # REDIRECT HTTP to HTTPS
    const expressrdr = express();
    expressrdr.get('*', async (req, res) => res.redirect(`https://${req.hostname}${req.url}`));
    // expressrdr.use(express.static(path.resolve('./public')));
    expressrdr.listen('80');
    console.info(`[${getTimestamp()}] Server redirecting from port ${'80'}`);
  };

  let app = express();

  app = await middleware(app);

  app = await routes(app);

  await startServer(app);
};

module.exports = { main };

// MAIN END
