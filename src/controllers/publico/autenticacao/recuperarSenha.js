/*
*   Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const httpCodes = require('../../../util/httpCodes');
const randomstring = require("randomstring");
const controllerEmail = require('../../email/controllerEnviarEmail');
const htmlRecuperarSenha = require('../../email/html/recuperarSenha');
require('dotenv');
exports.enviarRecuperacao = async (req, res) =>{

    
    if (req.body.email==undefined) return res.status(httpCodes.get('NaoAutorizado')).json({status: false, erros:[{msg:"Você deve passar um e-mail."}]});

    const buscaUsuario = await Usuario.findOne({email:req.body.email}).populate('pessoa').exec();
    
    if(!buscaUsuario) return res.status(httpCodes.get('NaoAutorizado')).json({status: false, msg:"Usuário não encontrado."});

    const token = randomstring.generate(15);
    
    await Usuario.update({email:req.body.email},{
        $set:{
            recuperarSenha: {
                token: token,
                ativo: true
            }
        }
    });
    const urlRecuperacao = `http://${process.env.AMBIENTE=="DEV"?"localhost:3000":descifre.com}/usuario/alterar-senha/${token}`;
    
    const htmlEnviar = htmlRecuperarSenha.htmlRetorno(buscaUsuario.pessoa.nome, urlRecuperacao);
    
    await controllerEmail.enviarEmail([buscaUsuario.email],"Recuperação de senha", htmlEnviar);

    return res.status(httpCodes.getValue('OK')).json({status: true, msg:"Um e-mail de recuperação foi enviado."});
};