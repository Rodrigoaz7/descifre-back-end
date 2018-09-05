const Enum = require('enum');

const permissoes = new Enum({
    'Administrador': "Administrador",
    'Usuario': "Usuario"
});
module.exports = permissoes;