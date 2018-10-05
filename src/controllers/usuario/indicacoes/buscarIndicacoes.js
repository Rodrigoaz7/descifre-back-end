/*
    Autor: Marcus Dantass
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const httpCodes = require('../../../util/httpCodes');
const Indicacao = mongoose.model('Indicacao');

exports.realizarBusca = async (req, res) =>{
    if(req.params.idUsuario == undefined) return res.status(httpCodes.getValue('NotFound')).json({status: false, erros:[{msg:"Você precisa passar um id de usuário."}]});
    
    let indicacoes;
    
    try {
        indicacoes = await Indicacao.find({idUsuarioQueIndincou: new ObjectID(req.params.idUsuario)}).populate('idUsuarioQueIndincou').populate('idUsuarioIndicado');
    } catch (error) {
        return res.status(httpCodes.getValue('ServerErro')).json({status: false, erros:[{msg:"Erro de processamento interno."}]});
    }
    
    return res.status(httpCodes.getValue('OK')).json({status:true, indicacoes: indicacoes});
}