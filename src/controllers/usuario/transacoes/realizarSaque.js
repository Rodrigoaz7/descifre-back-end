const validatorSaque = require('../../../validators/usuario/Transacoes/transacoes');
const httpCodes = require('../../../util/httpCodes');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Usuario = mongoose.model('Usuario');
const Transacao = mongoose.model('Transacao');
const crypto = require('crypto');

exports.realizarSaqueUsuario = async (req, res) =>{
    const erros = validatorSaque.errosCadastro(req);
    if(erros) return res.status(httpCodes.getValue('ReqInvalida')).json({status:false, erros: erros});
    const usuarioBanco = await Usuario.findOne({_id: new ObjectID(req.body.idUsuario)});

    if(!usuarioBanco) return res.status(httpCodes.getValue('NotFound')).json({status:false, erros: [{msg:"Usuário não encontrado."}]});

    if(usuarioBanco.quantidade_cifras<150) return res.status(httpCodes.getValue('NaoAutorizado')).json({status:false, erros: [{msg:"Usuário não possuí cifras suficientes para saque"}]});

    const senhaCriptografada = await crypto.createHash("md5").update(req.body.senha).digest("hex");

    if(usuarioBanco.senha!==senhaCriptografada) res.status(httpCodes.getValue('NaoAutorizado')).json({status:false, erros: [{msg:"Senha informada inválida"}]});

    if(!usuarioBanco.ganhadoresRodada || usuarioBanco.ganhadoresRodada==undefined) return res.status(httpCodes.getValue('NaoAutorizado')).json({status:false, erros: [{msg:"O saque está bloqueado pois o usuário ainda não atingiu nenhuma posição que forneça cifras a ele em uma rodada."}]});
    
    let novaTransacao = new Transacao({
        quantia_transferida: parseFloat(req.body.quantiaTransferida),
        enviado_por: req.body.idUsuario,
        recebido_por: req.body.idUsuario,
        tipo: 'saque', //Tipo pode ser 'saque', 'compra', 'transferencia', "premio"	
        status: 0
    });

    try {
        await novaTransacao.save();
        await Usuario.update({_id: new ObjectID(req.body.idUsuario)},{$inc:{quantidade_cifras:-parseFloat(req.body.quantiaTransferida)}});
        return res.status(httpCodes.getValue('OK')).json({status:true, msg:"Transação autorizada e está sendo processada."});
    } catch (error) {
        return res.status(httpCodes.getValue('ServerErro')).json({status:false, erros: [{msg:"Erro de processamento interno."}]});
    }
}