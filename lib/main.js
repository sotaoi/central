const path = require('path');
const express = require('express');
const https = require('https');
// const tls = require('tls');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
//
const { retrieveClientHandler } = require('@sotaoi/central/lib/handlers/client/retrieve-client-handler');
const { verifyGenericIntegrity } = require('@sotaoi/central/lib/helper');
const { Config } = require('@sotaoi/config');
const { storeClientHandler } = require('@sotaoi/central/lib/handlers/client/store-client-handler');
const { removeClientHandler } = require('@sotaoi/central/lib/handlers/client/remove-client-handler');
const { ErrorCode } = require('@sotaoi/central/lib/errors');
const formData = require('express-form-data');
const os = require('os');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
// displays {
const { AppState } = require('@sotaoi/central/lib/app-state');
const { blankLayout } = require('@sotaoi/central/lib/display/blank-layout');
const { notFoundScreen } = require('@sotaoi/central/lib/display/screens/not-found-screen');
const { errorScreen } = require('@sotaoi/central/lib/display/screens/error-screen');
const { gateLayout } = require('@sotaoi/central/lib/display/gate-layout/gate-layout');
const { gateLogin } = require('@sotaoi/central/lib/display/gate-layout/gate-login');
//
const { mainLayout } = require('@sotaoi/central/lib/display/main-layout/main-layout');
const { helloScreen } = require('@sotaoi/central/lib/display/main-layout/hello-screen');
const { centralEditClientScreen } = require('@sotaoi/central/lib/display/main-layout/central-edit-client-screen');
// }
const { authHandler } = require('@sotaoi/central/lib/handlers/api/auth-handler');
const { deauthHandler } = require('@sotaoi/central/lib/handlers/api/deauth-handler');
const { centralSaveHandler } = require('@sotaoi/central/lib/handlers/api/central-save-handler');

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

  https
    .createServer(
      {
        // SNICallback: async (currentDomain, cb) => {
        //   const secureContext = tls.createSecureContext(
        //     await (async () => {
        //       // other sync / async procedures can go here
        //       return {
        //         ...certs(),
        //       };
        //     })(),
        //   );
        //   if (cb) {
        //     cb(null, secureContext);
        //     return;
        //   }
        //   return secureContext;
        // },
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

const main = async () => {
  const app = express();

  const routes = {
    get: {},
    post: {},
  };

  const addRoute = (method, urlScheme, layout, middleware, action) => {
    if (['get', 'post'].indexOf(method) === -1) {
      throw new Error('Can only add "get" and "post" routes');
    }
    typeof routes[method][urlScheme] === 'undefined' &&
      !(routes[method][urlScheme] instanceof Array) &&
      (routes[method][urlScheme] = []);
    routes[method][urlScheme].push({
      layout,
      middleware: middleware || (() => true),
      action,
    });
  };

  const releaseRoutes = (app) => {
    const releaseRoute = (method, urlScheme, routes) => {
      app[method](urlScheme, async (req, res, next) => {
        try {
          const appState = new AppState(AppState.initialState(req));
          for (const route of routes) {
            if (!(await route.middleware(appState))) {
              continue;
            }
            return res.status(200).send(await route.layout(appState, await route.action(appState)));
          }
          return res.status(200).send(await blankLayout(appState, await notFoundScreen(appState)));
        } catch (err) {
          console.error(err);
          return res.status(200).send(await blankLayout(null, await errorScreen(null)));
        }
      });
    };
    Object.entries(routes.get).map(([urlScheme, routes]) => {
      releaseRoute('get', urlScheme, routes);
      releaseRoute('post', urlScheme, routes);
    });
  };

  app.use(
    formData.parse({
      uploadDir: os.tmpdir(),
      autoClean: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.resolve('./public')));
  app.use(cookieParser());

  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 2000, // limit each IP to 2000 requests per windowMs
  });

  app.use(limiter);

  const oneDay = 1000 * 60 * 60 * 24;
  app.use(
    sessions({
      secret: Config.env('APP_SECRET'),
      saveUninitialized: true,
      cookie: { maxAge: oneDay },
      resave: false,
    })
  );

  app.post('/client/store', storeClientHandler(app)); // store
  app.post('/client/retrieve/:clientName', retrieveClientHandler(app)); // retrieve
  app.post('/client/remove/:clientName', removeClientHandler(app)); // remove

  app.post('/api/auth', authHandler(app)); // admin login
  app.post('/api/deauth', deauthHandler(app)); // admin login
  app.post('/api/central/save', centralSaveHandler(app)); // central save

  addRoute(
    'get',
    '/',
    gateLayout,
    async (state) => {
      return !state.getState('app:auth_record');
    },
    gateLogin
  );

  addRoute(
    'get',
    '/',
    mainLayout,
    async (state) => {
      return !!state.getState('app:auth_record');
    },
    helloScreen
  );

  addRoute(
    'get',
    '/central/edit/:client',
    mainLayout,
    async (state) => {
      return !!state.getState('app:auth_record');
    },
    centralEditClientScreen
  );

  releaseRoutes(app);

  app.get('/api', async (req, res, next) => {
    const code = 200;
    return res.status(code).send({
      code,
      errorCode: null,
      success: true,
      title: 'Greetings',
      msg: 'Hello API Base',
      xdata: {},
      validations: null,
    });
  });

  app.use('/api', async (req, res, next) => {
    const code = 404;
    return res.status(code).send({
      code,
      errorCode: ErrorCode.APP_GENERIC_ERROR,
      success: false,
      title: 'Error',
      msg: 'Page Not Found',
      xdata: {},
      validations: null,
    });
  });

  app.use('/', async (req, res, next) => {
    try {
      const appState = new AppState(AppState.initialState(req));
      return res.status(200).send(await blankLayout(appState, await notFoundScreen(appState)));
    } catch (err) {
      console.error(err);
      return res.status(200).send(await blankLayout(null, await errorScreen(null)));
    }
  });

  await startServer(app);
};

module.exports = { main };
