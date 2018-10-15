/*
*   Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const httpCodes = require('../../../util/httpCodes');
const crypto = require('crypto');
exports.alterarSenha = async (req, res) =>{
    if (req.body.token==undefined) return res.status(httpCodes.get('NaoAutorizado')).json({status: false, erros:[{msg:"Você deve passar um token."}]});

    if(req.body.senha!==req.body.repetirSenha) res.status(httpCodes.get('NaoAutorizado')).json({status: false, erros:[{msg:"As senhas não são iguais"}]});

    if(req.body.senha.length<5) res.status(httpCodes.get('NaoAutorizado')).json({status: false, erros:[{msg:"A senha precisa ter pelo menos 5 caracteres."}]});

    const buscaUsuario = await Usuario.findOne({recuperarSenha:{token:req.body.token, ativo:true}}).populate('pessoa').exec();
    
    if(!buscaUsuario) return res.status(httpCodes.get('NaoAutorizado')).json({status: false, erros:[{msg:"Token inválido."}]});

    const novaSenha = await crypto.createHash("md5").update(req.body.senha).digest("hex");
    
    await Usuario.update({email:buscaUsuario.email},{
        $set:{
            recuperarSenha: {
                ativo: false
            },
            senha: novaSenha
        }
    });

    return res.status(httpCodes.getValue('OK')).json({status: true, msg:"Sua senha foi alterada com sucesso."});
};