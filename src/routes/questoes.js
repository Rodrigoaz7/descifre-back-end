const controllerCriarQuestao = require('../controllers/administrador/questoes/criarQuestao');
const controllerDeletarQuestao = require('../controllers/administrador/questoes/deletarQuestao');
const controllerAtualizarQuestao = require('../controllers/administrador/questoes/atualizarQuestao');

const variables = require('../../config/variables');

module.exports = (application) => {
    application.post(`${variables.base}/administrador/questoes/adicionar`, (req, res) => {controllerCriarQuestao.cadastrarQuestao(req, res)});
    application.delete(`${variables.base}/administrador/questoes/deletar`, (req, res) => {controllerDeletarQuestao.deletarQuestao(req, res)});
    application.put(`${variables.base}/administrador/questoes/atualizar`, (req, res) => {controllerAtualizarQuestao.atualizarQuestao(req, res)});
};