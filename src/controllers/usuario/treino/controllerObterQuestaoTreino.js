const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const httpCodes = require('../../../util/httpCodes');
const Treino = mongoose.model('Treino');
const Questao = mongoose.model('Questao');
exports.enviarQuestao = async (req, res) =>{
    if(!req.params.idTreino) return res.status(httpCodes.getValue('NotFound')).json({status:false, msg:"Você precisa enviar um id do treino."});

    if(!req.params.idUsuario) return res.status(httpCodes.getValue('NotFound')).json({status:false, msg:"Você precisa enviar um id do usuário."});

    let buscarTreino;

    try {
        buscarTreino = await Treino.findOne({_id: req.params.idTreino});
    } catch (error) {
        return res.status(httpCodes.getValue('ServerErro')).json({status:false, msg:"Erro de processamento interno: id do treino não é válido."});
    } 
    
    if(String(buscarTreino.usuario)!==String(req.params.idUsuario)) return res.status(httpCodes.getValue('ServerErro')).json({status:false, msg:"Erro de processamento interno: id do usuário não está associado ao treino."});

    if(!buscarTreino.vidaRecuperada.status) return res.status(httpCodes.getValue('OK')).json({status:false, msg:"Você não tem vidas suficientes para jogar."});
    
    let qntdQuestoes = await Questao.count();
    
    let randomNumber = Math.floor(Math.random() * qntdQuestoes);

    let questaoSelecionada = await Questao.findOne().populate('categoria').skip(randomNumber).exec();

    delete questaoSelecionada['corretaTexto'];
    delete questaoSelecionada['correta'];
    delete questaoSelecionada['pontuacao'];

    res.status(httpCodes.getValue('OK')).json({status: true, msg: "Questão enviada com sucesso.", questao: questaoSelecionada});

};