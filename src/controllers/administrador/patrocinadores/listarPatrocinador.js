/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
// const ObjectID = require('mongodb').ObjectID
const Token = mongoose.model('Token');
const Patrocinador = mongoose.model('Patrocinador');
const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
// const genericDAO = require('../../../util/genericDAO');
const utilToken = require('../../../util/token');
const matchSorter = require('match-sorter');

exports.listarPatrocinadores = async (req, res) => {

	const {nome} = req.query;
	let resultado = [];

	if(nome){
		resultado = await matchSorter(await Patrocinador.find({}).populate('rodadas_patrocinadas').exec(), nome, {keys: ['nome']});
		if(resultado.error) return returns.error(res, resultado);
	}
	else {
		resultado = await Patrocinador.find().populate('rodadas_patrocinadas').exec()
		if(resultado.error) return returns.error(res, resultado);
	}
    
    return res.status(httpCodes.get('OK')).json({status: true, 
    	msg:responses.getValue('dadosListados'), 
    	patrocinadores: resultado});
}
