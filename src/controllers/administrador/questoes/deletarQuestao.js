/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Questao = mongoose.model('Questao');
const Token = mongoose.model('Token');
const validators = require('../../../index');
const crypto = require('crypto');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const utilToken = require('../../../util/token');

exports.deletarQuestao = async (req, res) => {
    console.log("req body = " + req.body.id);
    let json_delete = {
        _id: new ObjectID(req.body.id)
    }

    let deletarQuestao = await genericDAO.deletarUmObjeto(Questao, json_delete);
    
    if(deletarQuestao.error) return returns.error(res, deletarQuestao);

    /* Retorno com sucesso */
    return res.status(httpCodes.get('OK')).json({status: true, msg:responses.getValue('questaoDeletada'), msg: deletarQuestao});
}