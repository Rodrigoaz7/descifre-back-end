/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Quiz = mongoose.model('Quiz');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');


exports.buscarQuizzes = async (req, res) => {
	const limite = 3;
	let limite_inferior = 0;

	if(req.params.pagina > 0){
		limite_inferior = parseInt(req.params.pagina)*limite-limite;	
	}
    
    const quizzesJogados = await Quiz.paginate(
    	{idUsuario: new ObjectID(req.params.idUsuario)},
    	{offset: limite_inferior, limit: limite, populate: ['idRodada'], sort: {'dataFinalizacao': -1}}
    );

    return res.status(httpCodes.get('OK')).json({status: true, msg:responses.getValue('BuscaRealizada'), quizzes: quizzesJogados.docs.reverse()});
};
