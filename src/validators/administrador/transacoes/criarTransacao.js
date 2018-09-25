/*
*   Autor Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Transacao = mongoose.model('Transacao');
const Usuario = mongoose.model('Usuario');

exports.errosCadastro = async (req) => {

    let erros = [];

    if(req.body.quantia_transferida === undefined || req.body.quantia_transferida === ""){
    	erros.push({msg: "A quantia precisa ser informada. "});
    }
    if(req.body.tipo !== "compra" && req.body.tipo !== "saque" && req.body.tipo !== "transferencia"){
        erros.push({msg: "Tipo precisa ser de compra, saque ou tranferencia. "});
    }
    if(req.body.id_enviado_por === null && req.body.id_recebido_por === null){
        erros.push({msg: "Deve-se haver pelo menos um usuario associado a uma transacao. "});
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