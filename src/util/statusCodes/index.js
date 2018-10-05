const Enum = require('enum');

const statusCodes = new Enum({
    'Enviado e Processando': 0,
    'Aceito': 1,
    'Recusado': 2
});
module.exports = statusCodes;