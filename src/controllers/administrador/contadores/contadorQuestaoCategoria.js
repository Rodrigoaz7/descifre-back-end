/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const utilToken = require('../../../util/token');

exports.contadorQuestaoCategoria = async (req, res) =>{

    let quantidadeQuestoes = 0;

    /* Populando os contadores */
    if(req.query.categoria){
        quantidadeQuestoes = await Questao.count({categoria: req.query.categoria});
    } else {
        quantidadeQuestoes = await Questao.count({});
    }
    
    let data = {
        status: true,
        quantidadeQuestoes: quantidadeQuestoes<30? parseInt(quantidadeQuestoes):parseInt(quantidadeQuestoes/30)
    };

    return res.status(parseInt(httpCodes.getValue("OK"))).json(data);
};