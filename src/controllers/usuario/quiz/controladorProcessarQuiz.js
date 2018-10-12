/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Rodada = mongoose.model('Rodada');
const Quiz = mongoose.model('Quiz');
const Questao = mongoose.model('Questao');

const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const tokenUtil = require('../../../util/token');
const imagemUtil = require('../../../util/handler_imagens/index');

exports.processarQuiz = async (req, res) => {
    const {idQuiz} = req.body;
    const questoes = req.body.questoes;
    const arrayQuestoes = questoes.map(questao => {return questao.idQuestao});
    
    //Verificando o quiz.
    const buscaQuiz = await Quiz.findOne({_id: new ObjectID(idQuiz)});
    if(!buscaQuiz) return res.status(httpCodes.getValue('NaoAutorizado')).json({status:false, msg:"O quiz que você tentou submeter é inválido."});

    /*
    *   Verificar se o usuário já jogou o quiz.
    *   buscaQUiz.jogadas.length
    * 
    */
   
    const buscaQuestoes = await Questao.find({
        '_id': { $in: arrayQuestoes}
    });
    let arrayRetorno = [];
    let pontuacao = 0;
    if(buscaQuestoes.length==questoes.length){
        buscaQuestoes.map((questao, index)=>{
            let indexQuestao = buscaQuestoes.findIndex(findQuestao => findQuestao._id==questoes[index].idQuestao);
            if(buscaQuestoes[indexQuestao].corretaTexto==questoes[index].alternativa){
                dataAppend = {
                    questao:buscaQuestoes[indexQuestao]._id,
                    status: true,
                    resposta: questoes[index].alternativa,
                    pontuacao: buscaQuestoes[indexQuestao].pontuacao
                }
            }else{
                dataAppend = {
                    questao:buscaQuestoes[indexQuestao]._id,
                    status: false,
                    resposta: questoes[index].alternativa,
                    pontuacao: 0
                }
            }
            pontuacao+=dataAppend.pontuacao;
            arrayRetorno.push(dataAppend);
        });
    }
    const buscarRodada = await Rodada.findOne({_id: new ObjectID(buscaQuiz.idRodada)});
    if(!(buscarRodada.jogadores.find(jogador => jogador.quiz==idQuiz))){
        // Push jogador na rodada;
        await Rodada.update({_id: new ObjectID(buscaQuiz.idRodada)},{$push:{jogadores:{
            quiz: idQuiz
        }}});

        // Push jogador quiz;
        await Quiz.update({_id: new ObjectID(idQuiz)},{$set:{jogadas:arrayRetorno, pontuacao:pontuacao}});
    }
    

    return res.status(httpCodes.getValue("OK")).json({status:true, msg: "Resultado final do quiz.", resultado: arrayRetorno, idRodada:buscaQuiz.idRodada});
};
