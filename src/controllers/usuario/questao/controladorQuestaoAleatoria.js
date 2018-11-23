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
const variaveis = require('../../../../config/variables');

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

    let arrayCategorias = ['5bbec3db9be1c212b3de8855', '5bbec3db9be1c212b3de8858',
        '5bbec3db9be1c212b3de8859', '5bbec3db9be1c212b3de8865',
        '5bbec3db9be1c212b3de8866', '5bbec3dc9be1c212b3de891f', 
        '5bbec3dc9be1c212b3de8925', '5bbec3dc9be1c212b3de8930',
        '5bbec3dc9be1c212b3de8932', '5bbec3dc9be1c212b3de8933',
        '5bbec3dc9be1c212b3de8934', '5bbec3dc9be1c212b3de8937',
        '5bbec3dc9be1c212b3de8a0b', '5bbec3dc9be1c212b3de8a0d',
        '5bbec3dc9be1c212b3de8a10', '5bbec3dc9be1c212b3de89fe', 
    ];
    
    let condicionalPesquisa = {};

    if(variaveis.ambiente!='dev'){
        condicionalPesquisa = {
            'categoria': {
                $in: arrayCategorias
            }
        };
    }
    console.log(condicionalPesquisa)
    let qntdQuestoes = await Questao.count(condicionalPesquisa);
    
    let randomNumber = Math.floor(Math.random() * qntdQuestoes);

    let questaoSelecionada = await Questao.findOne(condicionalPesquisa).populate('categoria').skip(randomNumber).exec();

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