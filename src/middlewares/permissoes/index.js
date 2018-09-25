/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Token = mongoose.model('Token');
const jwt = require('jsonwebtoken');
const secret = require('../../../config/variables').secret;
const tabelaPermisoes = require('../../util/permissoes');

/* Função responsável por realizar o bloqueamento das rotas */

const funcaoPermissao = (res, next, permissaoUser, token) =>{
    Token.findOne({token:token}, (err, data) => {  
        const _token = data;
        if(!_token) return res.status(401).json({status:false, renovarToken:false, tokenValido:false, msg: "Token inválido."});
        jwt.verify(token, secret, (err, decoded)=>{
            const dataToken = decoded;
            const time = new Date().getTime();
            
            if(time>(dataToken.exp*1000)) return res.status(401).json({status: false, renovarToken:true, tokenValido: false, msg: "Você precisa renovar seu token."});
            let permissaoEntrar = false;
            dataToken.permissoes.map((permissao, index) =>{
                if(permissao===permissaoUser) permissaoEntrar = true;
                return null;
            });
            if(permissaoEntrar) next();
            else return res.status(203).json({status:false, renovarToken:false, tokenValido:false, msg: "Usuário não autorizado."});
        });
    });
} 

exports.administrador = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.params.token;

    if(!token) return res.status(404).json({status:false, msg: "Você deve passar um token."});

    funcaoPermissao(res,next,tabelaPermisoes.getValue("Administrador"), token);
}

exports.usuario = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.params.token;

    if(!token) return res.status(404).json({status:false, msg: "Você deve passar um token."});

    funcaoPermissao(res,next,tabelaPermisoes.getValue("Public"), token);
}