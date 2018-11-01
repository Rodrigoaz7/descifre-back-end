const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controllerGetTreino = require('../controllers/usuario/treino/controllerGetTreino');
const controllerEntrarTreino = require('../controllers/usuario/treino/controllerEntrarTreino');
const controllerObterQuestao = require('../controllers/usuario/treino/controllerObterQuestaoTreino');

module.exports = (application) => {
    application.get(`${variables.base}/usuario/treino/:idUsuario/:token`, permissao.usuario, (req, res) => {controllerGetTreino.getTreino(req, res)});

    application.get(`${variables.base}/usuario/treino/questao/:idTreino/:idUsuario/:token`, permissao.usuario, (req, res) => {controllerObterQuestao.enviarQuestao(req, res)});

    application.post(`${variables.base}/usuario/treino`, permissao.usuario, (req, res) => {controllerEntrarTreino.entrarNoTreino(req, res)});
};