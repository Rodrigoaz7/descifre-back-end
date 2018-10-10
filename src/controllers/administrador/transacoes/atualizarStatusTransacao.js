/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Transacao = mongoose.model('Transacao');
const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const tokenUtil = require('../../../util/token');

exports.atualizarTransacao = async (req, res) => {

    let novaTransacao = {status: req.body.status}
    let get_transacao = { _id: new ObjectID(req.body.idTransacao) }
    
    let salvarTransacao = await genericDAO.atualizarUmObjeto(Transacao, get_transacao, novaTransacao);

    if(salvarTransacao.error) return returns.error(res, salvarTransacao);

    /* Retorno com sucesso */
    return res.status(httpCodes.get('Criado')).json({status: true, msg:responses.getValue('TransacaoAtualizada')});
};
