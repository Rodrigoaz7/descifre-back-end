/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Rodada = mongoose.model('Rodada');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');


exports.obterRodada = async (req, res) => {
    const rodadasAbertas = await Rodada.findOne({_id: new ObjectID(req.params.idRodada)}).populate('jogadores').populate('ganhadores').populate('abertoPor').populate('jogadores.quiz').exec();
    /* Retorno com sucesso */
    let jogadores = rodadasAbertas.jogadores;
    if(jogadores.length>1){
        let jogadoresSort = jogadores.sort((a, b) => parseFloat(a.quiz.pontuacao) - parseFloat(b.quiz.pontuacao));
        rodadasAbertas.jogadores = jogadoresSort.reverse();
    }
    

    return res.status(httpCodes.get('OK')).json({status: true, msg:responses.getValue('BuscaRealizada'), rodadas: rodadasAbertas});
};
