const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controllerAtualizarUsuarios = require('../controllers/administrador/usuarios/atualizarUsuarios');

module.exports = (application) => {
    application.put(`${variables.base}/administrador/perfil`, permissao.administrador, (req, res) => {controllerAtualizarUsuarios.atualizarUsuarios(req, res)});
};