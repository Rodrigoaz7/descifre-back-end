/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Transacao = mongoose.model('Transacao');
const Usuario = mongoose.model('Usuario');
const Token = mongoose.model('Token');
const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const utilToken = require('../../../util/token');
const matchSorter = require('match-sorter');
const quantidadeController = require('./quantidadeTransacoes');

exports.listarTransacoes = async (req, res) => {
	const limite = 10;
	const idUsuario = req.params.id
	let json_search = {enviado_por: new ObjectID(idUsuario)}
	let limite_inferior = 0;
	let quantidadeTransacoes = await quantidadeController.quantidadeTransacoes(idUsuario);

	if(req.params.pagina > 0){
		limite_inferior = parseInt(req.params.pagina)*limite-limite;
	}

	let lista_transacoes = await Transacao.paginate(
	{
		$or: [
			{enviado_por: new ObjectID(idUsuario)},
			{recebido_por: new ObjectID(idUsuario)}
		]},
		{offset: limite_inferior, limit: limite, populate: ['recebido_por', 'pessoa', 'enviado_por'],
			sort: {'data_transferencia': -1}}
	)
	
	if(lista_transacoes.error) return returns.error(res, lista_transacoes);

    return res.status(httpCodes.get('OK')).json({status: true, 
    	msg:responses.getValue('dadosListados'), 
    	transacoes: lista_transacoes.docs,
    	tamanhoTransacoes: quantidadeTransacoes
    });
}
