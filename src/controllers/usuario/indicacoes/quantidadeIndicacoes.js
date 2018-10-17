/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Indicacao = mongoose.model('Indicacao');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');

exports.numeroDeIndicacoes = async (req, res) => {
    const quant = await Indicacao.count({idUsuarioQueIndincou: new ObjectID(req.params.idUsuario)});
    return res.status(httpCodes.get('OK')).json({status: true, msg:responses.getValue('BuscaRealizada'), quantidade: quant});
};
