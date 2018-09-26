/*
* Autor: Marcus Dantas
*/
const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controladorAberturaQuiz = require('../controllers/usuario/quiz/controladorIniciarQuiz');
module.exports = (application) => {
	
    application.post(`${variables.base}/usuario/quiz/iniciar`, permissao.usuario, (req, res) => {controladorAberturaQuiz.iniciarQuiz(req, res)});

};