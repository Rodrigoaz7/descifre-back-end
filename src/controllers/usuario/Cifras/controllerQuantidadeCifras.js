/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const ObjectID = require('mongodb').ObjectID;
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const utilToken = require('../../../util/token');

exports.quantidadeCifras = async (req, res) =>{

	let usuario = []

	try{
		usuario = await Usuario.find({_id: new ObjectID(req.params.idUsuario)});
	} catch (error){
		return res.status(httpCodes.getValue('ReqInvalida')).json({status:false, erros:error});
	}

    let data = {
        status: true,
        quantidadeCifras: usuario[0].quantidade_cifras
    };

    return res.status(parseInt(httpCodes.getValue("OK"))).json(data);
};