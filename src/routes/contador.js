const controllerContadorDashboard = require('../controllers/administrador/contadores/homeScreen');
const controllerContadorQuestao = require('../controllers/administrador/contadores/contadorQuestaoCategoria');
const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');

module.exports = (application) => {
	
    application.get(`${variables.base}/administrador/contadores/dashboard/:token`, permissao.administrador, (req, res) => {controllerContadorDashboard.contadorHomeScreen(req,res)});
    application.get(`${variables.base}/administrador/contadores/questao/:token`, permissao.administrador, (req, res) => {controllerContadorQuestao.contadorQuestaoCategoria(req,res)});

};