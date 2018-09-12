const controllerContadorDashboard = require('../controllers/administrador/contadores/homeScreen');
const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');

module.exports = (application) => {
	
    application.get(`${variables.base}/administrador/contadores/dashboard/:token`, permissao.administrador, (req, res) => {controllerContadorDashboard.contadorHomeScreen(req,res)});

};