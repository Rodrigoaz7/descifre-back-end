/*
    Autor: Rodrigo Azevedo
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

exports.atualizarRodada = async (req, res) => {
	/* Get nos erros do formulário */
    const erros = validators.administrador.rodadas.criarRodada.errosCadastro(req);
   
    if (erros) return res.status(httpCodes.getValue('ReqInvalida')).json({status:false, erros:erros});
    
    let informacaoDecodificada = await tokenUtil.decoded(tokenUtil.getTokenRequest(req));
    
    req.body.abertoPor = informacaoDecodificada._id;

    let novaRodada = {
        duracao: req.body.duracao,
        taxa_entrada: req.body.taxa_entrada,
        titulo: req.body.titulo,
        dataAbertura: req.body.dataAbertura,
        dataFinalizacao: req.body.dataFinalizacao,
        ganhadores: req.body.ganhadores,
        pagamentoEmCifras: req.body.pagamentoEmCifras,
        premiacao: req.body.premiacao,
        premioVoucher: req.body.premiacaoTextoVoucher
    }

    let get_rodada = { _id: new ObjectID(req.body.id) }
    
    let salvarRodada = await genericDAO.atualizarUmObjeto(Rodada, get_rodada, novaRodada);

    if(salvarRodada.error) return returns.error(res, salvarRodada);

    /* Retorno com sucesso */
    return res.status(httpCodes.get('Criado')).json({status: true, msg:responses.getValue('rodadaCriada')});
};
