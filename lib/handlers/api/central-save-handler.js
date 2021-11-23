const { ErrorCode } = require('@sotaoi/central/lib/errors');
const { AppState } = require('@sotaoi/central/lib/app-state');
const fs = require('fs');

const centralSaveHandler = (app) => {
  return async (req, res, next) => {
    const state = new AppState(AppState.initialState(req));

    if (!state.getState('app:auth_record')) {
      throw new Error('Access denied');
    }

    let code = 200;
    let success = true;
    let title = 'Success';
    let msg = 'Central did save';

    try {
      const keys = require('@sotaoi/central/keys.json');

      const payload = {
        clientName: req.body.clientName || null,
        client: req.body.client || null,
      };

      if (!payload.clientName || !keys.clients[payload.clientName]) {
        throw new Error('Central save failed, bad client name');
      }

      keys.clients[payload.clientName].client = JSON.parse(payload.client);
      fs.writeFileSync(require.resolve('@sotaoi/central/keys.json'), JSON.stringify(keys, null, 2));

      return res.status(code).send({
        code,
        errorCode: null,
        success,
        title,
        msg,
        validations: null,
        xdata: {},
      });
    } catch (err) {
      console.error(err);
      code = typeof err === 'object' && err && err.code ? err.code : 400;
      success = false;
      title = 'Error';
      msg = typeof err === 'object' && err && err.message ? err.message : 'Central save failed';
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

module.exports = { centralSaveHandler };
