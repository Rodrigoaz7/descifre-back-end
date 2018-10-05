const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controllerCheckoutPagseguro = require('../controllers/usuario/pagseguro/controllerCompra');
const controllerBuscaPagseguro = require('../controllers/usuario/pagseguro/controllerBuscarTransacoesUsuario');
const controllerBuscaTransacao = require('../controllers/usuario/pagseguro/controllerBuscarUmaTransacao');
module.exports = (application) => {
    application.post(`${variables.base}/pagseguro/obter-codigo-checkout`, permissao.usuario, (req, res) => {controllerCheckoutPagseguro.realizarCheckout(req, res)});
    application.get(`${variables.base}/pagseguro/transacoes-usuario/:idUsuario/:token`, permissao.usuario, (req, res) => {controllerBuscaPagseguro.buscarTransacao(req, res)});
    application.get(`${variables.base}/pagseguro/transacao/:codigoTransacao/:token`, permissao.usuario, (req, res) => {controllerBuscaTransacao.buscarTransacao(req, res)});
};