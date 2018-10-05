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


exports.listarTransacoes = async (req, res) => {

	const idUsuario = req.params.id
	let json_search = {enviado_por: new ObjectID(idUsuario)}

	let lista_transacoes = await Transacao.find({
		$or: [
			{enviado_por: new ObjectID(idUsuario)},
			{recebido_por: new ObjectID(idUsuario)}
		]
	}).populate('recebido_por').populate('pessoa').populate('enviado_por').exec()
	
	if(lista_transacoes.error) return returns.error(res, lista_transacoes);

    return res.status(httpCodes.get('OK')).json({status: true, 
    	msg:responses.getValue('dadosListados'), 
    	transacoes: lista_transacoes});
}
