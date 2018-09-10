const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');
const controllerCriarRodada = require('../controllers/administrador/rodadas/criarRodada');

module.exports = (application) => {
    application.post(`${variables.base}/administrador/rodadas`, permissao.administrador, (req, res) => {controllerCriarRodada.cadastrarRodada(req, res)});

};