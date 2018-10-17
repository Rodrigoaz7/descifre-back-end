/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Quiz = mongoose.model('Quiz');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');


exports.numeroDeQuizzes = async (req, res) => {

    const quant = await Quiz.count({idUsuario: new ObjectID(req.params.idUsuario)});

    return res.status(httpCodes.get('OK')).json({status: true, msg:responses.getValue('BuscaRealizada'), quantidade: quant});
};
