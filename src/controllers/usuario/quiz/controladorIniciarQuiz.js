/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const Usuario = mongoose.model('Usuario');
const Rodada = mongoose.model('Rodada');
const Quiz = mongoose.model('Quiz');


const httpCodes = require('../../../util/httpCodes');
const utilRealizaCompra = require('../../../util/transacoes/realizarCompra');

exports.iniciarQuiz = async (req, res) => {
    // Salvando em variaveis o id do usuario e rodada.
    let {idUsuario} = req.body;
    let {idRodada} = req.body;

    // Buscando no banco o usuário e a rodada.
    let buscaRodada = await Rodada.findOne({_id: new ObjectID(idRodada)});
    let buscaUsuario = await Usuario.findOne({_id: new ObjectID(idUsuario)}).populate('pessoa').exec();
    
    // Verificação se existe os ids passados.
    if(!buscaRodada || !buscaUsuario) return res.status(httpCodes.getValue('NaoAutorizado')).json({status:false, msg:"Não foi possível iniciar a rodada, usuário ou rodada inválidas"});

    // Verificar se existe um quiz associado a rodada e ao usuário.

    let buscaQuiz = await Quiz.findOne({idUsuario: idUsuario, idRodada: idRodada});
    
    let dataAbertura = new Date();
    
    if(buscaQuiz!==null){
        let dataAberturaQuiz = new Date(buscaQuiz.dataAbertura);
        const dataFinalizacaoQuiz = new Date(buscaQuiz.dataFinalizacao);
        let dataJogada = new Date(dataAberturaQuiz.getTime()+parseInt(buscaRodada.duracao)*60000);

        
        if(dataAbertura.getTime()<dataFinalizacaoQuiz.getTime() && dataAbertura.getTime()<dataJogada.getTime()) return res.status(httpCodes.getValue('OK')).json({status: true,resultados:false, idQuiz: buscaQuiz._id, msg: "Você pode continuar a jogar o quiz."});
        else if(buscaQuiz.jogadas.length>0) return res.status(httpCodes.getValue('OK')).json({status: true, resultados:true, quiz: buscaQuiz});
        else if(dataAbertura.getTime() > dataFinalizacaoQuiz.getTime() || dataAbertura.getTime()>dataJogada.getTime()) return res.status(httpCodes.getValue('NaoAutorizado')).json({status:false,resultados:false, msg:"Você já jogou esse quiz e o tempo foi esgotado."});
    }
    // Nenhum quiz encontrado.
    
    let realizarCompra = await utilRealizaCompra.realizarCompra(buscaUsuario._id, buscaRodada.taxa_entrada);

    if(!realizarCompra) return res.status(httpCodes.getValue('NaoAutorizado')).json({status: true, resultados:false, msg: "Você não possuí cifras suficientes para entrar na rodada, realize uma recarga :)."});

    // Verificar se o usuário tem saldo.
    // Se tiver realizar transação de compra do quiz.
    
    const dataFinalizacao = new Date(dataAbertura.getTime()+parseInt(buscaRodada.duracao)*60000);

    const novoQuiz = new Quiz({
        idUsuario: buscaUsuario._id,
        idRodada:buscaRodada._id,
        nomeUsuario: buscaUsuario.pessoa.nome,
        pontuacao: 0,
        jogadas:[],
        dataAbertura: dataAbertura,
        dataFinalizacao: dataFinalizacao,
    }); 

    await novoQuiz.save();

    return res.status(httpCodes.getValue('OK')).json({status: true, resultados:false, idQuiz: novoQuiz._id, msg: "Você pode iniciar o quiz."});


}