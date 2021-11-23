const { verifySupercredentials } = require('@sotaoi/central/lib/helper');
const { storeClientRoutine } = require('@sotaoi/central/lib/routines/store-client-routine');
const { ErrorCode } = require('@sotaoi/central/lib/errors');

const storeClientHandler = (app) => {
  return async (req, res, next) => {
    let code = 200;
    let success = true;
    let title = 'Success';
    let msg = 'Client stored successfully';
    try {
      const {
        clientName = null,
        clientId = null,
        clientSecret = null,
        superusername = null,
        superpassword = null,
      } = typeof req.body === 'object' && req.body ? req.body : {};

      if (!(await verifySupercredentials(superusername, superpassword))) {
        const err = new Error('Bad super credentials');
        err.code = 401;
        throw err;
      }

      const client = await storeClientRoutine(clientName, clientId, clientSecret, superusername, superpassword);

      return res.status(code).send({
        code,
        errorCode: null,
        success,
        title,
        msg,
        validations: null,
        xdata: {
          client,
        },
      });
    } catch (err) {
      console.error(err);
      code = typeof err === 'object' && err && err.code ? err.code : 400;
      success = false;
      title = 'Error';
      msg = typeof err === 'object' && err && err.message ? err.message : 'Client storing failed';
      return res.status(code).send({
        code,
        errorCode: ErrorCode.APP_GENERIC_ERROR,
        success,
        title,
        msg,
        validations: null,
        xdata: {
          client: null,
        },
      });
    }
  };
};

module.exports = { storeClientHandler };
