/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Rodada = mongoose.model('Rodada');
const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const tokenUtil = require('../../../util/token');

exports.removerRodada = async (req, res) => {
    
    let json_delete = {
        _id: new ObjectID(req.body.id)
    }

    let deletarRodada = await genericDAO.deletarUmObjeto(Rodada, json_delete);
    
    if(deletarRodada.error) return returns.error(res, deletarRodada);

    /* Retorno com sucesso */
    return res.status(httpCodes.get('OK')).json({status: true, msg:responses.getValue('rodadaDeletada')});
};
