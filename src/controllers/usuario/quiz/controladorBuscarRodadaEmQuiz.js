/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Quiz = mongoose.model('Quiz');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');


exports.buscarQuizzes = async (req, res) => {
    const quizzesJogados = await Quiz.find({idUsuario: new ObjectID(req.params.idUsuario)}).populate('idRodada').exec();
    
    return res.status(httpCodes.get('OK')).json({status: true, msg:responses.getValue('BuscaRealizada'), quizzes: quizzesJogados});
};
