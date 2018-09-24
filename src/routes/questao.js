const controllerCriarQuestao = require('../controllers/administrador/questoes/criarQuestao');
const controllerDeletarQuestao = require('../controllers/administrador/questoes/deletarQuestao');
const controllerAtualizarQuestao = require('../controllers/administrador/questoes/atualizarQuestao');
const controllerGetQuestao = require('../controllers/administrador/questoes/listarQuestoes');
const controllerObterCategorias = require('../controllers/administrador/categoriasQuestoes/obterCategorias');
const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');

module.exports = (application) => {
	
    application.post(`${variables.base}/administrador/questoes`, permissao.administrador, (req, res) => {controllerCriarQuestao.cadastrarQuestao(req, res)});

    application.delete(`${variables.base}/administrador/questoes`, permissao.administrador,(req, res) => {controllerDeletarQuestao.deletarQuestao(req, res)});

    application.put(`${variables.base}/administrador/questoes`,permissao.administrador, (req, res) => {controllerAtualizarQuestao.atualizarQuestao(req, res)});

    application.get(`${variables.base}/administrador/questoes/:token`, permissao.administrador, (req, res) => {controllerGetQuestao.listarQuestoes(req, res)});

    application.get(`${variables.base}/administrador/questoes/categoria/:token`, permissao.administrador, (req, res) => {controllerObterCategorias.listar(req, res);});
    
};