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
const matchSorter = require('match-sorter');

exports.listarRodadas = async (req, res) => {

	const {titulo, situacao, data_abertura, data_fechamento} = req.query;
	let json_search = {};

	if(titulo) {
		let resultado = await matchSorter(await Rodada.find({}), titulo, {keys: ['titulo']});
		let titulos = [];
		for(let i=0; i<resultado.length; i++) {
			titulos.push(resultado[i].titulo);
		}
		json_search.titulo = titulos;
	}

	if(data_abertura) {
		let date = new Date(data_abertura);
		date = new Date(date.getTime() - 3*60*60000);
		// json_search.dataAbertura = {$gte: new Date(date), 
		// 	$lte:(new Date(new Date(date).getTime() + 1*24*60*60000))};
		json_search.dataAbertura = {$gte: new Date(date)};
	}

	if(data_fechamento) {

		let datef = new Date(data_fechamento);
		datef = new Date(datef.getTime() - 3*60*60000);
		// json_search.dataFinalizacao = {$gt: new Date(datef), 
		// 	$lt:(new Date(new Date(datef).getTime() + 1*24*60*60000))};
		json_search.dataFinalizacao = {$lte: new Date(datef)};
	}

	if(situacao){
		let data_agora = new Date();
		if(situacao == "Aberto"){
			json_search.dataAbertura = {$lte: (data_agora)}
			json_search.dataFinalizacao = {$gte: (data_agora)}
		} else {
			json_search = { $or: [ { dataAbertura: {$gt: data_agora} }, { dataFinalizacao: {$lt:data_agora} } ] }
		}
	}

	let lista_rodadas = await Rodada.find({...json_search}).populate('jogadores').populate('ganhadores').populate('abertoPor').exec()
	if(lista_rodadas.error) return returns.error(res, lista_rodadas);
    
    return res.status(httpCodes.get('OK')).json({status: true, 
    	msg:responses.getValue('dadosListados'), 
    	rodadas: lista_rodadas});
}
