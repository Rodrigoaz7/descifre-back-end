const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controllerCadastrarTransacoes = require('../controllers/administrador/transacoes/cadastrarTransacao');
const controllerListarTransacoes = require('../controllers/administrador/transacoes/listarTransacoes');
const controllerLitarTransacoesUsuario = require('../controllers/usuario/transacoes/listarTransacoes');

module.exports = (application) => {
    application.get(`${variables.base}/administrador/transacoes/:token/:limite`, permissao.administrador, (req, res) => {controllerListarTransacoes.listarTransacoes(req, res)});
    application.get(`${variables.base}/usuario/transacoes/:token/:id`, permissao.usuario, (req, res) => {controllerLitarTransacoesUsuario.listarTransacoes(req, res)});
    application.post(`${variables.base}/administrador/transacoes`, permissao.usuario, (req, res) => {controllerCadastrarTransacoes.cadastrarTransacao(req, res)});
};