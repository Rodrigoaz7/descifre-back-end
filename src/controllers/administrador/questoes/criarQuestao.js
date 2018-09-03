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

exports.cadastrarQuestao = async (req, res) => {
	/* Get nos erros do formulário */
    const erros = validators.administrador.questoes.criarQuestao.errosCadastro(req);
    if (erros) return res.status(httpCodes.getValue('ReqInvalida')).json({status:false, erros:erros});
    
    let novaQuestao = new Questao({
        usuario: new ObjectID(req.body.usuario),
        enunciado: req.body.enunciado,
        alternativas: req.body.alternativas,
        categoria: req.body.categoria,
        correta: req.body.correta,
        pontuacao: req.body.pontuacao,
        dataCriacao: req.body.dataCriacao
    });

    let salvarQuestao = await genericDAO.salvar(novaQuestao);
    
    if(salvarQuestao.error) return returns.error(res, salvarQuestao);

    /* Retorno com sucesso */
    return res.status(httpCodes.get('Criado')).json({status: true, msg:responses.getValue('questaoCriado')});
}