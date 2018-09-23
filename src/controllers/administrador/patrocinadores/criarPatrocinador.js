/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Rodada = mongoose.model('Rodada');
const Patrocinador = mongoose.model('Patrocinador');
const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const tokenUtil = require('../../../util/token');

exports.cadastrarPatrocinador = async (req, res) => {
	/* Get nos erros do formulário */
    const erros = validators.administrador.patrocinadores.criarPatrocinador.errosCadastro(req);
    if (erros) return res.status(httpCodes.getValue('ReqInvalida')).json({status:false, erros:erros});
    
    //let informacaoDecodificada = await tokenUtil.decoded(tokenUtil.getTokenRequest(req));
    //req.body.abertoPor = informacaoDecodificada._id;

    let novoPatrocinador = new Patrocinador(req.body);
    let salvarPatrocinador = await genericDAO.salvar(novoPatrocinador);

    if(salvarPatrocinador.error) return returns.error(res, salvarPatrocinador);

    /* Retorno com sucesso */
    return res.status(httpCodes.get('Criado')).json({status: true, msg:responses.getValue('rodadaCriada')});
};
