const variables = require('../../config/variables');
const permissao = require('../middlewares/permissoes');
const controllerVerificarVoucher = require('../controllers/patrocinador/voucher/controllerVerificarVoucher');
const controllerAtivarVoucher = require('../controllers/patrocinador/voucher/controllerAtivarVoucher');
module.exports = (application) => {
	application.get(`${variables.base}/patrocinador/voucher/:codigoVoucher/:token`,permissao.patrocinador, (req, res) =>{controllerVerificarVoucher.realizarVerificacao(req, res)});
	application.post(`${variables.base}/patrocinador/voucher/`,permissao.patrocinador, (req, res) =>{controllerAtivarVoucher.realizarAtivacao(req, res)});
};