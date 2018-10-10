const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Transacao = mongoose.model('Transacao');
const Usuario = mongoose.model('Usuario');
const genericDAO = require('../genericDAO');

exports.realizarCompra = async (idEnviadoPor, valorCompra) =>{
    
    // Buscando user no banco
    const usuarioQueRealizaACompra = await Usuario.findOne({_id: new ObjectID(idEnviadoPor)});

    if(usuarioQueRealizaACompra.quantidade_cifras<valorCompra) return false;
    
    // Subtraindo valor da compra
    let NovoValorCifrasUsuarioCompra = usuarioQueRealizaACompra.quantidade_cifras - valorCompra;

    await Usuario.update({_id:new ObjectID(idEnviadoPor)},{$set:{quantidade_cifras:NovoValorCifrasUsuarioCompra}});

    let novaTransacao = new Transacao({
        enviado_por: new ObjectID(idEnviadoPor),
        recebido_por: new ObjectID(idEnviadoPor),
        tipo: "compra",
        quantia_transferida: valorCompra,
        data_transferencia: new Date(),
        status: 1
    });

    let salvarTransacao = await genericDAO.salvar(novaTransacao);

    if(salvarTransacao.error) return false;
    return true;
}