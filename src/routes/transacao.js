const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controllerCadastrarTransacoes = require('../controllers/administrador/transacoes/cadastrarTransacao');
const controllerAtualizarTransacoes = require('../controllers/administrador/transacoes/atualizarStatusTransacao');
const controllerListarTransacoes = require('../controllers/administrador/transacoes/listarTransacoes');
const controllerLitarTransacoesUsuario = require('../controllers/usuario/transacoes/listarTransacoes');
const controllerSaqueUsuario = require('../controllers/usuario/transacoes/realizarSaque');

module.exports = (application) => {
    application.get(`${variables.base}/administrador/transacoes/:token/:pagina`, permissao.administrador, (req, res) => {controllerListarTransacoes.listarTransacoes(req, res)});
    application.post(`${variables.base}/administrador/transacoes`, permissao.administrador, (req, res) => {controllerCadastrarTransacoes.cadastrarTransacao(req, res)});
    application.put(`${variables.base}/administrador/transacoes`, permissao.administrador, (req, res) => {controllerAtualizarTransacoes.atualizarTransacao(req, res)});

    application.get(`${variables.base}/usuario/transacoes/:token/:id/:pagina`, permissao.usuario, (req, res) => {controllerLitarTransacoesUsuario.listarTransacoes(req, res)});
    application.post(`${variables.base}/usuario/transacoes/saque`, permissao.usuario, (req, res) => {controllerSaqueUsuario.realizarSaqueUsuario(req, res)});

};