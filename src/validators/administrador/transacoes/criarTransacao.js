/*
*   Autor Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Transacao = mongoose.model('Transacao');
const Usuario = mongoose.model('Usuario');
const crypto = require('crypto');

exports.errosCadastro = async (req) => {

    let erros = [];

    let user = await Usuario.findOne({_id: new ObjectID(req.body.id_enviado_por)});

    if(user === null){
        erros.push({msg: "Usuário não existe."});
    }

    req.body.senha = await crypto.createHash("md5").update(req.body.senha).digest("hex");

    if(user.senha !== req.body.senha){
        erros.push({msg: "Senha inválida."});
    }
    if(req.body.quantia_transferida === undefined || req.body.quantia_transferida === "" || req.body.quantia_transferida === 0){
    	erros.push({msg: "A quantia precisa ser informada. "});
    }
    if(req.body.tipo !== "compra" && req.body.tipo !== "saque" && req.body.tipo !== "transferência"){
        erros.push({msg: "Tipo precisa ser de compra, saque ou tranferência. "});
    }
    if(parseFloat(user.quantidade_cifras) < parseFloat(req.body.quantia_transferida)){
        erros.push({msg: "Você não possui cifras suficientes. Faça uma recarga."});
    }
    if(req.body.id_enviado_por === null && req.body.id_recebido_por === null){
        erros.push({msg: "Deve-se haver pelo menos um usuário associado a uma transação. "});
    }
    if(req.body.tipo === "compra" && req.body.id_enviado_por !== req.body.id_recebido_por){
    	erros.push({msg: "Erro no envio dos usuarios. "});	
    }
    if(req.body.tipo === "saque" && req.body.id_recebido_por !== req.body.id_enviado_por){
    	erros.push({msg: "Erro no envio dos usuarios. "});	
    }
    if(req.body.tipo === "transferencia" && req.body.id_recebido_por === req.body.id_enviado_por){
    	erros.push({msg: "Não se pode transferir cifras pra si própio. "});	
    }
    if(req.body.tipo === "transferencia" && req.body.id_recebido_por !== req.body.id_enviado_por){
    	const enviatario = await Usuario.findOne({_id: new ObjectID(req.body.id_enviado_por)});
    	const receptario = await Usuario.findOne({_id: new ObjectID(req.body.id_recebido_por)});
    	if(enviatario === null || receptario === null){
    		erros.push({msg: "Usuário(s) não existe(m). "});
    	}
		else if(enviatario.quantidade_cifras < req.body.quantia_transferida){
    		erros.push({msg: "Você não possui cifras suficientes para tal transferência. "});
    	}
    }
    return erros;
};