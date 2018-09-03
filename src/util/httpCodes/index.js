const Enum = require('enum');

const httpCodes = new Enum({
    'OK': 200,
    'Criado': 201,
    'Aceito': 202,
    'InformacaoParcial': 203,
    'ReqInvalida': 400,
    'NaoAutorizado': 401,
    'NotFound': 404,
    'ServerErro': 500,
    'NaoImplementado': 501,
});
module.exports = httpCodes;