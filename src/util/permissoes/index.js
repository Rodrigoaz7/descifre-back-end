const Enum = require('enum');

const permissoes = new Enum({
    'Administrador': "Administrador",
    'Usuario': "Usuario",
    'Public':'Public'
});
module.exports = permissoes;