/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Patrocinador = mongoose.model('Patrocinador');
const Token = mongoose.model('Token');
const validators = require('../../../index');
const crypto = require('crypto');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const utilToken = require('../../../util/token');

exports.atualizarPatrocinador = async (req, res) => {
    
     /* Get nos erros do formulário */
    const erros = validators.administrador.patrocinadores.criarPatrocinador.errosCadastro(req);
    if (erros) return res.status(httpCodes.getValue('NaoAutorizado')).json({status:false, erros:erros});

    let json_search = {
        _id: new ObjectID(req.body.id)
    }

    let json_update = {
    	
    }

    let atualizarPatrocinador = await genericDAO.atualizarUmObjeto(Patrocinador, json_search, json_update);
    if(atualizarPatrocinador.error) return returns.error(res, atualizarPatrocinador);

    /* Retorno com sucesso */
    return res.status(httpCodes.get('OK')).json({status: true, msg:responses.getValue('questaoAtualizada'), msg: atualizarQuestao});
}
