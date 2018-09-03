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

exports.atualizarQuestao = async (req, res) => {
    
     /* Get nos erros do formulário */
    const erros = validators.administrador.questoes.criarQuestao.errosCadastro(req);
    if (erros) return res.status(httpCodes.getValue('NaoAutorizado')).json({status:false, erros:erros});

    // Apenas buscando por id, for now.
    let json_search = {
    	_id: new ObjectID(req.body.id)
    }
    let json_update = {
    	usuario: new ObjectID(req.body.usuario),
	    enunciado: req.body.enunciado,
	    alternativas: req.body.alternativas,
	    categoria: req.body.categoria,
	    correta: req.body.correta,
	    pontuacao: req.body.pontuacao,
	    dataCriacao: req.body.dataCriacao
    }

    let atualizarQuestao = await genericDAO.atualizarUmObjeto(Questao, json_search, json_update);
    
    if(atualizarQuestao.error) return returns.error(res, atualizarQuestao);

    /* Retorno com sucesso */
    return res.status(httpCodes.get('OK')).json({status: true, msg:responses.getValue('questaoAtualizada'), msg: atualizarQuestao});
}
