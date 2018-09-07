/*
*   Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const Pessoa = mongoose.model('Pessoa');
const Token = mongoose.model('Token');
const validators = require('../../../index');
const httpCodes = require('../../../util/httpCodes');
const returns = require('../../../util/returns');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const utilToken = require('../../../util/token');
const crypto = require('crypto');

exports.realizarLogin = async (req, res) =>{

    /* Get nos erros do formulário */
    const erros = validators.publico.autenticacao.login.errosLogin(req);
    if (erros) return res.status(httpCodes.get('NaoAutorizado')).json({status: false, erros});

    /*
    *   Dados do usuário no ato do login:
    *   req.body.email
    *   req.body.senha
    */

    /* Encriptando a senha */
    req.body.senha = await crypto.createHash("md5").update(req.body.senha).digest("hex");

    const buscaUsuario = await Usuario.findOne({email:req.body.email}).populate('pessoa').exec();
    
    if(!buscaUsuario) returns.usuarioInvalido(res);

    if(req.body.senha !== buscaUsuario.senha) return returns.usuarioInvalido(res);
    
    const token = utilToken.gerarToken({...buscaUsuario._doc}, 720);
    await utilToken.salvarToken(token);

    return res.status(httpCodes.getValue('OK')).json({status: true, usuario: buscaUsuario, token: token});
};