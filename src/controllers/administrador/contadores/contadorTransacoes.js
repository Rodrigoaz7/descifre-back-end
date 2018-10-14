/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const Transacao = mongoose.model('Transacao');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const utilToken = require('../../../util/token');

exports.contadorTransacoes = async (req, res) =>{

    let quantidade = await Transacao.count({});
    
    let data = {
        status: true,
        quantidade: quantidade
    };

    return res.status(parseInt(httpCodes.getValue("OK"))).json(data);
};