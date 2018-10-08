const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controllerCheckoutPagseguro = require('../controllers/usuario/pagseguro/controllerCompra');
module.exports = (application) => {
    application.post(`${variables.base}/pagseguro/obter-codigo-checkout`, permissao.usuario, (req, res) => {controllerCheckoutPagseguro.realizarCheckout(req, res)});
};