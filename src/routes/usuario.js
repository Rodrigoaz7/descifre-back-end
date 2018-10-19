const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controllerListarUsuarios = require('../controllers/administrador/usuarios/listarUsuairos');
const controllerQuantCifras = require('../controllers/usuario/Cifras/controllerQuantidadeCifras');

module.exports = (application) => {
    application.get(`${variables.base}/administrador/usuarios/:token/:pagina`, permissao.administrador, (req, res) => {controllerListarUsuarios.listarUsuarios(req, res)});

    application.get(`${variables.base}/usuario/quantidadeCifras/:token/:idUsuario`, permissao.usuario, (req, res) => {controllerQuantCifras.quantidadeCifras(req, res)});

};