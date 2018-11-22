const variables = require('../../config/variables');
const permissao = require('../middlewares/permissoes');
const controllerVerificarVoucher = require('../controllers/patrocinador/voucher/controllerVerificarVoucher');
const controllerAtivarVoucher = require('../controllers/patrocinador/voucher/controllerAtivarVoucher');
const controllerVerVouchers = require('../controllers/usuario/voucher/controllerVerVouchers');
const controllerGetVouchers = require('../controllers/patrocinador/voucher/controllerGetVouchers');
module.exports = (application) => {
	application.get(`${variables.base}/patrocinador/voucher/:codigoVoucher/:token`,permissao.patrocinador, (req, res) =>{controllerVerificarVoucher.realizarVerificacao(req, res)});

	application.get(`${variables.base}/patrocinador/voucher/:token`,permissao.patrocinador, (req, res) =>{controllerGetVouchers.obterVouchers(req, res)});

	application.post(`${variables.base}/patrocinador/voucher/`,permissao.patrocinador, (req, res) =>{controllerAtivarVoucher.realizarAtivacao(req, res)});

	application.get(`${variables.base}/usuario/voucher/:idUsuario/:token`,permissao.usuario, (req, res) =>{controllerVerVouchers.verVouchers(req, res)});
};