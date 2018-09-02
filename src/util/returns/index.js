const httpCodes = require('../httpCodes');
const responses = require('../responses');
exports.error = (res, obj) => {
   return res.status(httpCodes.get('ServerErro')).json({status: false, msg: responses.getValue('problemaInterno'), code: obj.code, msgDev:obj.msgDev});
};