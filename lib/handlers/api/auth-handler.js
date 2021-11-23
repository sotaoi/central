const { ErrorCode } = require('@sotaoi/central/lib/errors');
const { verifySupercredentials } = require('@sotaoi/central/lib/helper');
// const { AppState } = require('@sotaoi/central/lib/app-state');

const authHandler = (app) => {
  return async (req, res, next) => {
    // const state = new AppState(AppState.initialState(req));

    let code = 200;
    let success = true;
    let title = 'Success';
    let msg = 'You are authenticated';
    try {
      let authRecord = null;

      if (await verifySupercredentials(req.body.username, req.body.password)) {
        authRecord = {
          username: req.body.username,
        };
        req.session.auth_record = JSON.stringify(authRecord);
      }

      if (!authRecord) {
        code = 401;
        title = 'Failed';
        msg = 'Authentication failed';
      }

      return res.status(code).send({
        code,
        errorCode: null,
        success,
        title,
        msg,
        validations: null,
        xdata: {
          authRecord,
        },
      });
    } catch (err) {
      console.error(err);
      code = typeof err === 'object' && err && err.code ? err.code : 400;
      success = false;
      title = 'Error';
      msg = typeof err === 'object' && err && err.message ? err.message : 'Authentication failed';
      return res.status(code).send({
        code,
        errorCode: ErrorCode.APP_GENERIC_ERROR,
        success,
        title,
        msg,
        validations: null,
        xdata: {},
      });
    }
  };
};

module.exports = { authHandler };
