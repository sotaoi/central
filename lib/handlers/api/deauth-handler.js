const { ErrorCode } = require('@sotaoi/central/lib/errors');
const { AppState } = require('@sotaoi/central/lib/app-state');

const deauthHandler = (app) => {
  return async (req, res, next) => {
    const state = new AppState(AppState.initialState(req));

    let code = 200;
    let success = true;
    let title = 'Success';
    let msg = 'You are deauthenticated';
    try {
      let authRecord = null;

      if (!(await state.getState('app:auth_record'))) {
        code = 400;
        title = 'Failed';
        msg = 'Deauthentication failed';
      }

      if (await state.getState('app:auth_record')) {
        req.session.auth_record = '';
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
      msg = typeof err === 'object' && err && err.message ? err.message : 'Deauthentication failed';
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

module.exports = { deauthHandler };
