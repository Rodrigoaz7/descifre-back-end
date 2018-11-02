/*
    Autor: Marcus Dantass
*/
const mongoose = require('mongoose');
const httpCodes = require('../../../util/httpCodes');
const Treino = mongoose.model('Treino');

exports.getTreino = async (req, res) => {
    if(!req.params.idUsuario) return res.status(httpCodes.getValue('NotFound')).json({
        status:false,
        erros:[{msg:"Você deve passar um id de usuário para entrar no modo treino."}]
    });
    
    try {
        const buscarPorTreino = await Treino.findOne({usuario: req.params.idUsuario},'-questoesJogadas');
        if(!buscarPorTreino) return res.status(httpCodes.getValue('OK')).json({status:false, msg:"Você ainda não entrou no treino, clique aqui para entrar agora."});
        return res.status(httpCodes.getValue('OK')).json({status:true, msg:"Você já entrou em um treino :)", treino: buscarPorTreino});
    } catch (error) {
        return res.status(httpCodes.getValue('OK')).json({status:false, msg:"Erro ao processar seu treino, usuário inválido."});
    }
    
}