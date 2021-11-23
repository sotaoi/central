const { verifySupercredentials, getClient } = require('@sotaoi/central/lib/helper');
const { removeClientRoutine } = require('@sotaoi/central/lib/routines/remove-client-routine');
const { ErrorCode } = require('@sotaoi/central/lib/errors');

const removeClientHandler = (app) => {
  return async (req, res, next) => {
    let code = 200;
    let success = true;
    let title = 'Success';
    let msg = 'Client removed successfully';
    try {
      const clientName = req.params.clientName || null;
      const { superusername = null, superpassword = null } = typeof req.body === 'object' && req.body ? req.body : {};

      if (!(await verifySupercredentials(superusername, superpassword))) {
        const err = new Error('Bad super credentials');
        err.code = 401;
        throw err;
      }

      const client = await getClient(clientName);
      if (!client) {
        const err = new Error('Client not found');
        err.code = 404;
        throw err;
      }

      await removeClientRoutine(clientName, superusername, superpassword);

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
      msg = typeof err === 'object' && err && err.message ? err.message : 'Client removal failed';
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

module.exports = { removeClientHandler };
