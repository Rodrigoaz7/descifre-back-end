const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controllerCadastrarTransacoes = require('../controllers/administrador/transacoes/cadastrarTransacao');
const controllerListarTransacoes = require('../controllers/administrador/transacoes/listarTransacoes');

module.exports = (application) => {
    application.get(`${variables.base}/administrador/transacoes`, permissao.administrador, (req, res) => {controllerListarTransacoes.listarTransacoes(req, res)});
    application.post(`${variables.base}/administrador/transacoes`, permissao.administrador, (req, res) => {controllerCadastrarTransacoes.cadastrarTransacao(req, res)});
};