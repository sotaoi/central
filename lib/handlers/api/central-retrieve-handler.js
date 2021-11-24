const { ErrorCode } = require('@sotaoi/central/lib/errors');
const { encrypt } = require('@sotaoi/central/lib/opt/central');
const fs = require('fs');
const path = require('path');

const centralRetrieveHandler = (app) => {
  return async (req, res, next) => {
    let code = 200;
    let success = true;
    let title = 'Success';
    let msg = 'Central served environment files';

    try {
      const payload = {
        clientName: req.body.client_name || null,
        clientId: req.body.client_id || null,
        clientSecret: req.body.client_secret || null,
      };

      const keys = JSON.parse(fs.readFileSync(path.resolve('./keys.json')).toString());

      if (!payload.clientName || !keys.clients[payload.clientName] || !keys.clients[payload.clientName].client) {
        throw new Error('Central retrieve failed, invalid client');
      }

      if (!payload.clientId || !payload.clientSecret) {
        throw new Error('Central retrieve failed, missing payload items');
      }

      const client = keys.clients[payload.clientName];
      if (
        !client ||
        !client.client_id ||
        !client.client_secret ||
        !client.key ||
        client.client_id !== payload.clientId ||
        client.client_secret !== payload.clientSecret
      ) {
        throw new Error('Access denied');
      }

      //

      return res.status(code).send({
        code,
        errorCode: null,
        success,
        title,
        msg,
        validations: null,
        xdata: {
          env: await encrypt(JSON.stringify(client.client), client.key),
        },
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

module.exports = { centralRetrieveHandler };
