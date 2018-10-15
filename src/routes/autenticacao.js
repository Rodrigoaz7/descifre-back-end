const controllerCadastro = require('../controllers/publico/autenticacao/cadastro');
const controllerLogin = require('../controllers/publico/autenticacao/login');
const controllerLogout = require('../controllers/publico/autenticacao/logout');
const controllerCadastroIndicacao = require('../controllers/publico/autenticacao/cadastroIndicacao');
const variables = require('../../config/variables');
const controllerEnviarRecuperacao = require('../controllers/publico/autenticacao/recuperarSenha');
const controllerAlterarSenha = require('../controllers/publico/autenticacao/alterarSenha');

module.exports = (application) => {
    application.post(`${variables.base}/publico/login`, (req, res) => {controllerLogin.realizarLogin(req, res)});
    
    application.post(`${variables.base}/publico/cadastro`, (req, res) => {controllerCadastro.realizarCadastro(req, res)});

    application.post(`${variables.base}/publico/cadastro-indicacao`, (req, res) => {controllerCadastroIndicacao.realizarCadastro(req, res)});

    application.post(`${variables.base}/publico/recuperar-senha`, (req, res) => {controllerEnviarRecuperacao.enviarRecuperacao(req, res)});

    application.post(`${variables.base}/publico/alterar-senha`, (req, res) => {controllerAlterarSenha.alterarSenha(req, res)});

    application.delete(`${variables.base}/publico/logout`, (req, res) =>{controllerLogout.realizarLogout(req, res)});
    
};