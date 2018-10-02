/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
// const genericDAO = require('../../../util/genericDAO');
const utilToken = require('../../../util/token');
const controllerCategoria = require('../categoriasQuestoes/listaCategoria');
const mongoosePaginate = require('mongoose-paginate');

exports.listarQuestoes = async (req, res) => {

	let lista_categorias = await controllerCategoria.listarCategorias(req, res);
	let lista_questoes = [];
	let limite_inferior = 0;
	let quantidade_retornada = 30;
	
	if(req.query.limite){
		limite_inferior = parseInt(req.query.limite)*30-30;
	}

	console.log(limite_inferior)

	if(req.query.categoria){
		lista_questoes = await Questao.paginate({
			categoria: req.query.categoria, 
		},{
			offset: limite_inferior, limit: quantidade_retornada, populate: ['categoria', 'usuario']
		});
	}
	else {
		lista_questoes = await Questao.paginate({}, {
			offset: limite_inferior, limit: quantidade_retornada, populate: ['categoria', 'usuario']
		});
	}

    // Chamando a query diretamente no return para não sobrecarregar memória
    return res.status(httpCodes.get('OK')).json({status: true, 
    	msg:responses.getValue('dadosListados'), 
    	questoes: lista_questoes.docs,
    	categorias: lista_categorias});
}
