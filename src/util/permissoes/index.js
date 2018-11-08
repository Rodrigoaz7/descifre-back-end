const Enum = require('enum');

const permissoes = new Enum({
    'Administrador': "Administrador",
    'Usuario': "Usuario",
    'Public':'Public',
    'Patrocinador': 'Patrocinador'
});
module.exports = permissoes;