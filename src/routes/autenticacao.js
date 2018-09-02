const controllerCadastro = require('../controllers/publico/autenticacao/cadastro');
const controllerLogin = require('../controllers/publico/autenticacao/login');

module.exports = (application) => {
    application.post('/publico/login', (req, res) => {controllerLogin.realizarLogin(req, res)});
    application.post('/publico/cadastro', (req, res) => {controllerCadastro.realizarCadastro(req, res)});
};