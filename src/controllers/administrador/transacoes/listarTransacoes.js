/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
// const ObjectID = require('mongodb').ObjectID
const Transacao = mongoose.model('Transacao');
const Pessoa = mongoose.model('Pessoa');
const Usuario = mongoose.model('Usuario');
const Token = mongoose.model('Token');
const validators = require('../../../index');
// const crypto = require('crypto');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
// const genericDAO = require('../../../util/genericDAO');
const utilToken = require('../../../util/token');
const matchSorter = require('match-sorter');


exports.listarTransacoes = async (req, res) => {
	const limite = 20;
	const { tipo, data, user } = req.query;

	let pagina = req.params.pagina;
	let json_search = {};
	let limite_inferior = 0;

	if(pagina > 0){
        limite_inferior = parseInt(pagina)*limite-limite;
    }

	if(tipo) {
		json_search.tipo = tipo;
	}
	
	if(data) {
		json_search.data_transferencia = {$gte: new Date(data), $lt:(new Date(new Date(data).getTime() + 1*24*60*60000))};
	}

	if(user) {
 		let resultado = matchSorter(await Usuario.find(), user, {keys: ['email']});
 		json_search.recebido_por = resultado;
	}

	//let lista_transacoes = await Transacao.find({...json_search}).populate('recebido_por').populate('pessoa').populate('enviado_por').limit(parseInt(req.params.limite)).exec()
	let lista_transacoes = await Transacao.paginate({...json_search},
    {
        offset: limite_inferior, limit: limite, populate: ['recebido_por', 'pessoa', 'enviado_por'], sort: {'data_transferencia': -1}
    });

	if(lista_transacoes.error) return returns.error(res, lista_transacoes);

    return res.status(httpCodes.get('OK')).json({status: true, 
    	msg:responses.getValue('dadosListados'), 
    	transacoes: lista_transacoes.docs});
}
