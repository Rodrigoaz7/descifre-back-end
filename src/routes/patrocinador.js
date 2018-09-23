const controllerCriarPatrocinador = require('../controllers/administrador/patrocinadores/criarPatrocinador');
// const controllerDeletarQuestao = require('../controllers/administrador/questoes/deletarQuestao');
// const controllerAtualizarQuestao = require('../controllers/administrador/questoes/atualizarQuestao');
const controllerGetPatrocinador = require('../controllers/administrador/patrocinadores/listarPatrocinador');
const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');

module.exports = (application) => {
	
    application.post(`${variables.base}/administrador/patrocinadores`, permissao.administrador, (req, res) => {controllerCriarPatrocinador.cadastrarPatrocinador(req, res)});

    // application.delete(`${variables.base}/administrador/questoes`, permissao.administrador,(req, res) => {controllerDeletarQuestao.deletarQuestao(req, res)});

    // application.put(`${variables.base}/administrador/questoes`,permissao.administrador, (req, res) => {controllerAtualizarQuestao.atualizarQuestao(req, res)});

    application.get(`${variables.base}/administrador/patrocinadores/:token`, permissao.administrador, (req, res) => {controllerGetPatrocinador.listarPatrocinadores(req, res)});

};