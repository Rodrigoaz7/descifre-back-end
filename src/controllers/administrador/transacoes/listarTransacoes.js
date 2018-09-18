/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
// const ObjectID = require('mongodb').ObjectID
const Transacao = mongoose.model('Transacao');
const Token = mongoose.model('Token');
const validators = require('../../../index');
// const crypto = require('crypto');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
// const genericDAO = require('../../../util/genericDAO');
const utilToken = require('../../../util/token');

exports.listarTransacoes = async (req, res) => {

	let lista_transacoes = await Transacao.find({}).populate('enviado_por').populate('recebido_por').limit(10).exec()
	if(lista_transacoes.error) return returns.error(res, lista_transacoes);
    
    // Chamando a query diretamente no return para não sobrecarregar memória
    return res.status(httpCodes.get('OK')).json({status: true, 
    	msg:responses.getValue('dadosListados'), 
    	rodadas: lista_transacoes});
}
