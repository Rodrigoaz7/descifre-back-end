/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Transacao = mongoose.model('Transacao');
const Usuario = mongoose.model('Usuario');
const Token = mongoose.model('Token');
const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const utilToken = require('../../../util/token');

exports.cadastrarTransacao = async (req, res) => {

    /* Se tipo for igual a saque, o enviatario sera igual ao receptario
    * Se tipo for igual a compra, o recepitario sera igual ao enviatario
    * Se tipo for transferencia, então existiram os dois campos de usuarios
    */
    /* Get nos erros do formulário */
    const erros = await validators.administrador.transacoes.criarTransacao.errosCadastro(req);
    if (erros.length > 0) return res.status(httpCodes.getValue('ReqInvalida')).json({status:false, erros:erros});

    let json_search = {};
    let json_set = {};
    const user_enviatario = await Usuario.findOne({_id: new ObjectID(req.body.id_enviado_por)});
    const user_receptario = await Usuario.findOne({_id: new ObjectID(req.body.id_recebido_por)});
    console.log(user_receptario)
    // Funcoes de transferencias para cada tipo de transacao
    if(req.body.tipo === "transferencia"){

        json_search = {_id: new ObjectID(req.body.id_enviado_por)};
        json_set = {quantidade_cifras: parseInt(user_enviatario.quantidade_cifras) - 
            parseInt(req.body.quantia_transferida)};
        
        let user = await genericDAO.atualizarUmObjeto(Usuario, json_search, json_set);
        if(user.error) return returns.error(res, user);

        json_search = {_id: new ObjectID(req.body.id_recebido_por)};
        json_set = {quantidade_cifras: parseInt(user_receptario.quantidade_cifras) + 
            parseInt(req.body.quantia_transferida)};
       
        user = await genericDAO.atualizarUmObjeto(Usuario, json_search, json_set);
        if(user.error) return returns.error(res, user);

    }
    else if(req.body.tipo === "compra"){
        json_search = {_id: new ObjectID(req.body.id_recebido_por)};
        json_set = {quantidade_cifras: parseInt(user_receptario.quantidade_cifras) + 
            parseInt(req.body.quantia_transferida)};
        
        var user = await genericDAO.atualizarUmObjeto(Usuario, json_search, json_set);
        if(user.error) return returns.error(res, user);
    }
    else if(req.body.tipo === "saque"){
        json_search = {_id: new ObjectID(req.body.id_enviado_por)};
        json_set = {quantidade_cifras: parseInt(user_enviatario.quantidade_cifras) - 
            parseInt(req.body.quantia_transferida)};
        
        let user = await genericDAO.atualizarUmObjeto(Usuario, json_search, json_set);
        if(user.error) return returns.error(res, user);
    }

    let novaTransacao = new Transacao({
        enviado_por: new ObjectID(req.body.id_enviado_por),
        recebido_por: new ObjectID(req.body.id_recebido_por),
        tipo: req.body.tipo,
        quantia_transferida: req.body.quantia_transferida,
        data_transferencia: req.body.data_transferencia
    });

    let salvarTransacao = await genericDAO.salvar(novaTransacao);

    if(salvarTransacao.error) return returns.error(res, salvarTransacao);

    /* Retorno com sucesso */
    return res.status(httpCodes.get('Criado')).json({status: true, msg:responses.getValue('TransacaoRelizada')});
}