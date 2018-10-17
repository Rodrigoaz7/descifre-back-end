/*
* Autor: Marcus Dantas
*/
const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controladorAberturaQuiz = require('../controllers/usuario/quiz/controladorIniciarQuiz');
const controladorProcessarQuiz = require('../controllers/usuario/quiz/controladorProcessarQuiz');
const controladorBuscarRodadaEmQuiz = require('../controllers/usuario/quiz/controladorBuscarRodadaEmQuiz');
const controladorQuantidadeQuiz = require('../controllers/usuario/quiz/controladorContadorQuiz');


module.exports = (application) => {
	
    application.post(`${variables.base}/usuario/quiz/iniciar`, permissao.usuario, (req, res) => {controladorAberturaQuiz.iniciarQuiz(req, res)});
    
    application.post(`${variables.base}/usuario/quiz/processar`, permissao.usuario, (req, res) => {controladorProcessarQuiz.processarQuiz(req, res)});

    application.get(`${variables.base}/usuario/quiz/buscar-rodadas/:idUsuario/:token/:pagina`, permissao.usuario, (req, res) => {controladorBuscarRodadaEmQuiz.buscarQuizzes(req, res)});

    application.get(`${variables.base}/usuario/quiz/quantidade/:idUsuario/:token`, permissao.usuario, (req, res) => {controladorQuantidadeQuiz.numeroDeQuizzes(req, res)});

};