const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controllerCriarRodada = require('../controllers/administrador/rodadas/criarRodada');
const controllerRemoverRodada = require('../controllers/administrador/rodadas/deletarRodada');
const controllerRodadas = require('../controllers/administrador/rodadas/listarRodadas')

module.exports = (application) => {
    application.post(`${variables.base}/administrador/rodadas`, permissao.administrador, (req, res) => {controllerCriarRodada.cadastrarRodada(req, res)});
    application.delete(`${variables.base}/administrador/rodadas`, permissao.administrador, (req, res) => {controllerRemoverRodada.removerRodada(req, res)});
    application.get(`${variables.base}/administrador/rodadas/:token`, permissao.administrador, (req, res) => {controllerRodadas.listarRodadas(req, res)});

};