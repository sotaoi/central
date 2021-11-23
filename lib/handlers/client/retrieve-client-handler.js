const { safeGetClient } = require('@sotaoi/central/lib/helper');
const { ErrorCode } = require('@sotaoi/central/lib/errors');

const retrieveClientHandler = (app) => {
  return async (req, res, next) => {
    let code = 200;
    let success = true;
    let title = 'Success';
    let msg = 'Client retrieved successfully';
    try {
      const clientName = req.params.clientName || null;
      const { clientId = null, clientSecret = null } = typeof req.body === 'object' && req.body ? req.body : {};

      const client = await safeGetClient(clientName, clientId, clientSecret);

      if (!client) {
        const err = new Error('Client not found');
        err.code = 404;
        throw err;
      }

      return res.status(code).send({
        code,
        errorCode: null,
        success,
        title,
        msg,
        validations: null,
        xdata: {
          clientName,
          clientId,
          client,
        },
      });
    } catch (err) {
      console.error(err);
      code = typeof err === 'object' && err && err.code ? err.code : 400;
      success = false;
      title = 'Error';
      msg = typeof err === 'object' && err && err.message ? err.message : 'Client retrieval failed';
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

module.exports = { retrieveClientHandler };
