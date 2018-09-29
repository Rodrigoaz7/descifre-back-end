/*
* Autor: Marcus Dantas
*/
const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controladorAberturaQuiz = require('../controllers/usuario/quiz/controladorIniciarQuiz');
const controladorProcessarQuiz = require('../controllers/usuario/quiz/controladorProcessarQuiz');

module.exports = (application) => {
	
    application.post(`${variables.base}/usuario/quiz/iniciar`, permissao.usuario, (req, res) => {controladorAberturaQuiz.iniciarQuiz(req, res)});
    
    application.post(`${variables.base}/usuario/quiz/processar`, permissao.usuario, (req, res) => {controladorProcessarQuiz.processarQuiz(req, res)});

};