const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controllerGetTreino = require('../controllers/usuario/treino/controllerGetTreino');
const controllerEntrarTreino = require('../controllers/usuario/treino/controllerEntrarTreino');
const controllerObterQuestao = require('../controllers/usuario/treino/controllerObterQuestaoTreino');
const controllerProcessarQuestao = require('../controllers/usuario/treino/controllerVerfificarQuestaoTreino');
const controllerListarRanking = require('../controllers/usuario/treino/controllerRankingTreino');

module.exports = (application) => {
    application.get(`${variables.base}/usuario/treino/:idUsuario/:token`, permissao.usuario, (req, res) => {controllerGetTreino.getTreino(req, res)});

    application.get(`${variables.base}/usuario/treino/questao/:idTreino/:idUsuario/:token`, permissao.usuario, (req, res) => {controllerObterQuestao.enviarQuestao(req, res)});

    application.get(`${variables.base}/usuario/treino/ranking/:idUsuario/:token/:pagina`, permissao.usuario, (req, res) => {controllerListarRanking.getRankingTreino(req, res)});

    application.post(`${variables.base}/usuario/treino`, permissao.usuario, (req, res) => {controllerEntrarTreino.entrarNoTreino(req, res)});

    application.post(`${variables.base}/usuario/treino/questao`, permissao.usuario, (req, res) => {controllerProcessarQuestao.processarQuestao(req, res)});
};