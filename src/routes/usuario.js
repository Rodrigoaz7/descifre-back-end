const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controllerListarUsuarios = require('../controllers/administrador/usuarios/listarUsuairos');
module.exports = (application) => {
    application.get(`${variables.base}/administrador/usuarios/:token/:pagina`, permissao.administrador, (req, res) => {controllerListarUsuarios.listarUsuarios(req, res)});

};