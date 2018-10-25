/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Rodada = mongoose.model('Rodada');
const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const tokenUtil = require('../../../util/token');
const gerarGanhadoresRodada = require('../../../../scripts/gerarGanhadoresRodada');

exports.cadastrarRodada = async (req, res) => {
	/* Get nos erros do formulário */
    const erros = validators.administrador.rodadas.criarRodada.errosCadastro(req);
   
    if (erros) return res.status(httpCodes.getValue('ReqInvalida')).json({status:false, erros:erros});
    
    let informacaoDecodificada = await tokenUtil.decoded(tokenUtil.getTokenRequest(req));
    
    req.body.abertoPor = informacaoDecodificada._id;

    let novaRodada = new Rodada(req.body);

    let salvarRodada = await genericDAO.salvar(novaRodada);

    if(salvarRodada.error) return returns.error(res, salvarRodada);

    // Criando job para finalizar rodada.
    gerarGanhadoresRodada.criarJobFinalizarRodada(novaRodada.dataFinalizacao, novaRodada._id);
    
    /* Retorno com sucesso */
    return res.status(httpCodes.get('Criado')).json({status: true, msg:responses.getValue('rodadaCriada')});
};
