const { retrieveClientHandler } = require('@sotaoi/central/lib/handlers/client/retrieve-client-handler');
const { storeClientHandler } = require('@sotaoi/central/lib/handlers/client/store-client-handler');
const { removeClientHandler } = require('@sotaoi/central/lib/handlers/client/remove-client-handler');
//
const { authHandler } = require('@sotaoi/central/lib/handlers/api/auth-handler');
const { deauthHandler } = require('@sotaoi/central/lib/handlers/api/deauth-handler');
const { centralSaveHandler } = require('@sotaoi/central/lib/handlers/api/central-save-handler');
const { centralRetrieveHandler } = require('@sotaoi/central/lib/handlers/api/central-retrieve-handler');
// displays {
const { AppState } = require('@sotaoi/central/lib/app-state');
const { blankLayout } = require('@sotaoi/central/lib/display/blank-layout');
const { notFoundScreen } = require('@sotaoi/central/lib/display/screens/not-found-screen');
const { errorScreen } = require('@sotaoi/central/lib/display/screens/error-screen');
const { gateLayout } = require('@sotaoi/central/lib/display/gate-layout/gate-layout');
const { gateLogin } = require('@sotaoi/central/lib/display/gate-layout/gate-login');
//
const { appLayout } = require('@sotaoi/central/lib/display/app-layout/app-layout');
const { helloScreen } = require('@sotaoi/central/lib/display/app-layout/hello-screen');
const { centralEditClientScreen } = require('@sotaoi/central/lib/display/app-layout/central-edit-client-screen');
// }

const routes = async (app) => {
  //

  app.post('/client/store', storeClientHandler(app)); // store
  app.post('/client/retrieve/:clientName', retrieveClientHandler(app)); // retrieve
  app.post('/client/remove/:clientName', removeClientHandler(app)); // remove

  app.post('/api/auth', authHandler(app)); // admin login
  app.post('/api/deauth', deauthHandler(app)); // admin login
  app.post('/api/central/save', centralSaveHandler(app)); // central save
  app.post('/api/central/retrieve', centralRetrieveHandler(app)); // central save

  //

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
    appLayout,
    async (state) => {
      return !!state.getState('app:auth_record');
    },
    helloScreen
  );
  addRoute(
    'get',
    '/central/edit/:client',
    appLayout,
    async (state) => {
      return !!state.getState('app:auth_record');
    },
    centralEditClientScreen
  );

  releaseRoutes(app);

  //

  return app;
};

const _routes = {
  get: {},
  post: {},
};

const addRoute = (method, urlScheme, layout, middleware, action) => {
  if (['get', 'post'].indexOf(method) === -1) {
    throw new Error('Can only add "get" and "post" routes');
  }
  typeof _routes[method][urlScheme] === 'undefined' &&
    !(_routes[method][urlScheme] instanceof Array) &&
    (_routes[method][urlScheme] = []);
  _routes[method][urlScheme].push({
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
  Object.entries(_routes.get).map(([urlScheme, routes]) => {
    releaseRoute('get', urlScheme, routes);
    releaseRoute('post', urlScheme, routes);
  });
};

module.exports = { routes };
