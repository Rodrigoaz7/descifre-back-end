const variables = require('../../config/variables');
const controllerBuscarIndicacoes = require('../controllers/usuario/indicacoes/buscarIndicacoes');
const controllerQuantidadeIndicacoes = require('../controllers/usuario/indicacoes/quantidadeIndicacoes');

module.exports = (application) => {
	
	application.get(`${variables.base}/usuario/indicacoes/quantidade/:idUsuario/:token`, (req, res) =>{controllerQuantidadeIndicacoes.numeroDeIndicacoes(req, res)});

    application.get(`${variables.base}/usuario/indicacoes/:idUsuario/:token/:pagina`, (req, res) =>{controllerBuscarIndicacoes.realizarBusca(req, res)});

};