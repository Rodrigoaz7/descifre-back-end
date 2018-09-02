const controllerCastro = require('../controllers/publico/autenticacao/cadastro');
module.exports = (application) => {
    application.post('/publico/login', (req, res) => { });
    application.post('/publico/cadastro', (req, res) => {controllerCastro.realizarCadastro(req, res)});
};