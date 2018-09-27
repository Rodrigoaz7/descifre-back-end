/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const Usuario = mongoose.model('Usuario');
const Rodada = mongoose.model('Rodada');
const Quiz = mongoose.model('Quiz');
const Questao = mongoose.model('Questao');

const httpCodes = require('../../../util/httpCodes');


exports.gerarQuestaoAleatoria = async (req, res) => {
    // Salvando em variaveis o id do usuario e rodada.
    let {idQuiz} = req.body;
    let {idUsuario} = req.body;

    // Verificar se existe um quiz associado a rodada e ao usuário.

    let buscaQuiz = await Quiz.findOne({_id: new ObjectID(idQuiz), idUsuario: idUsuario});
    
    let dataAbertura = new Date();
    
    if(buscaQuiz!==null){
        let buscaRodada = await Rodada.findOne({_id: new ObjectID(buscaQuiz.idRodada)});
        let dataAberturaQuiz = new Date(buscaQuiz.dataAbertura);
        const dataFinalizacaoQuiz = new Date(buscaQuiz.dataFinalizacao);
        let dataJogada = new Date(dataAberturaQuiz.getTime()+parseInt(buscaRodada.duracao)*60000);
        if(dataAbertura.getTime() > dataFinalizacaoQuiz.getTime() || dataAbertura.getTime()>dataJogada.getTime()) return res.status(httpCodes.getValue('NaoAutorizado')).json({status:true, finalizado:true, msg:"Você já jogou esse quiz e o tempo foi esgotado."});
    }
    
    let qntdQuestoes = await Questao.count();
    
    let randomNumber = Math.floor(Math.random() * qntdQuestoes);

    let questaoSelecionada = await Questao.findOne().populate('categoria').skip(randomNumber).exec();
    delete questaoSelecionada['corretaTexto'];
    delete questaoSelecionada['correta'];
    delete questaoSelecionada['pontuacao'];
    while(true){
        if(!buscaQuiz.jogadas.find(x=> x.questao==questaoSelecionada._id)){
            break;
        }
        questaoSelecionada = await Questao.findOne().populate('categoria').skip(randomNumber).exec();
        delete questaoSelecionada['corretaTexto'];
        delete questaoSelecionada['correta'];
        delete questaoSelecionada['pontuacao'];
    }
    
    return res.status(httpCodes.getValue('OK')).json({status: true, finalizado:false, questao: questaoSelecionada});


}