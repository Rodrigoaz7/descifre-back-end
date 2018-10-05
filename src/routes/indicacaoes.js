const variables = require('../../config/variables');
const controllerBuscarIndicacoes = require('../controllers/usuario/indicacoes/buscarIndicacoes');

module.exports = (application) => {
    application.get(`${variables.base}/usuario/indicacoes/:idUsuario/:token`, (req, res) =>{controllerBuscarIndicacoes.realizarBusca(req, res)});
};