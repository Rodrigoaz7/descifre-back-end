/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Token = mongoose.model('Token');
const Usuario = mongoose.model('Usuario');
const Patrocinador = mongoose.model('Patrocinador');
const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const utilToken = require('../../../util/token');
const imagemUtil = require('../../../util/handler_imagens/index');
const fs = require('fs');

exports.listarImagem = async (req, res) => {

	if(req.query.id && req.query.tipo){
		let resultado = [];

		if(req.query.tipo === "patrocinador"){
			let patrocinador = await Patrocinador.findOne({_id: new ObjectID(req.query.id)});
			if(patrocinador === null) return res.status(httpCodes.get('NotFound')).json({status: false, msg:"Patrocinador com esse id não existe."});
			resultado = patrocinador.logomarca;
		}
		else if(req.query.tipo === "usuario"){
			let user = await Usuario.findOne({_id: new ObjectID(req.query.id)});
			if(user === null) return res.status(httpCodes.get('NotFound')).json({status: false, msg:"Usuario com esse id não existe."});
			resultado = user.foto;
		}
		else {
			return res.status(httpCodes.get('NotFound')).json({status: false, msg:"Tipo deve ser usuario ou patrocinador."});
		}
		return res.sendFile(resultado);
    }
    else {
    	return res.status(httpCodes.get('NotFound')).json({status: false, msg:"Você deve passar o id e o tipo"});
    }    
}
