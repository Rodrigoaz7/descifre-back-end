/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
// const ObjectID = require('mongodb').ObjectID
const Rodada = mongoose.model('Rodada');
const Token = mongoose.model('Token');
const validators = require('../../../index');
// const crypto = require('crypto');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
// const genericDAO = require('../../../util/genericDAO');
const utilToken = require('../../../util/token');

exports.listarRodadas = async (req, res) => {

	let lista_rodadas = await Rodada.find({}).populate('jogadores').populate('ganhadores').populate('abertoPor').exec()
	if(lista_rodadas.error) return returns.error(res, lista_rodadas);
    
    // Chamando a query diretamente no return para não sobrecarregar memória
    return res.status(httpCodes.get('OK')).json({status: true, 
    	msg:responses.getValue('dadosListados'), 
    	rodadas: lista_rodadas});
}
