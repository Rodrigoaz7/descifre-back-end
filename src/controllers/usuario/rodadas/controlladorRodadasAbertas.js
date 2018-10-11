/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Rodada = mongoose.model('Rodada');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');


exports.obterRodadasAbertas = async (req, res) => {
	const dataAtual = new Date();
	let condicoesDeData = {dataAbertura: {$lte: dataAtual}, dataFinalizacao: {$gte:dataAtual}}

    const rodadasAbertas = await Rodada.find({
        ...condicoesDeData
    }).populate('jogadores').populate('ganhadores').populate('abertoPor').exec();
    
    /* Retorno com sucesso */
    return res.status(httpCodes.get('OK')).json({status: true, msg:responses.getValue('BuscaRealizada'), rodadas: rodadasAbertas});
};
