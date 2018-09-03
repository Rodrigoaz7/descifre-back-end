const controllerCadastro = require('../controllers/publico/autenticacao/cadastro');
const controllerLogin = require('../controllers/publico/autenticacao/login');
const controllerLogout = require('../controllers/publico/autenticacao/logout');
const variables = require('../../config/variables');

module.exports = (application) => {
    application.post(`${variables.base}/publico/login`, (req, res) => {controllerLogin.realizarLogin(req, res)});
    application.post(`${variables.base}/publico/cadastro`, (req, res) => {controllerCadastro.realizarCadastro(req, res)});
    application.delete(`${variables.base}/publico/logout`, (req, res) =>{controllerLogout.realizarLogout(req, res)});
    
};