const controllerImagem = require('../controllers/imagem/imagem_controller/listarImagem');
const permissao = require('../middlewares/permissoes');
const variables = require('../../config/variables');

module.exports = (application) => {
	
    application.get(`${variables.base}/imagem/:token`, permissao.usuario, (req, res) => {controllerImagem.listarImagem(req,res)});

};