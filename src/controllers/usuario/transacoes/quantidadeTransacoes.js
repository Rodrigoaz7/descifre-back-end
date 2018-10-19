/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Transacao = mongoose.model('Transacao');
const Usuario = mongoose.model('Usuario');
const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const utilToken = require('../../../util/token');


exports.quantidadeTransacoes = async (idUsuario) => {

	let quantidade = await Transacao.count({
		$or: [
			{enviado_por: new ObjectID(idUsuario)},
			{recebido_por: new ObjectID(idUsuario)}
		]}
	);
	
	return quantidade;
}
