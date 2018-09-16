/*
    Autor: Rodrigo de Azevedo
*/
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const Pessoa = mongoose.model('Pessoa');
const validators = require('../../../index');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const ObjectID = require('mongodb').ObjectID;
const crypto = require('crypto');
const returns = require('../../../util/returns');
const genericDAO = require('../../../util/genericDAO');
const utilToken = require('../../../util/token');

exports.atualizarUsuarios = async (req, res) => {
	/* Get nos erros do formulário */
    const erros = validators.administrador.perfil.atualizaPerfil.errosCadastro(req);
    if (erros) return res.status(httpCodes.getValue('NaoAutorizado')).json({status:false, erros:erros});

    // Atualizando os dados de uma pessoa, primeiramente.
    let json_search_pessoa = {
    	_id: new ObjectID(req.body.pessoa)
    }
    let json_update_pessoa = {
    	nome: req.body.nome,
    	email: req.body.email,
    	telefone: req.body.telefone,
    	sexo: req.body.sexo,
    	conta: req.body.conta,
    	agencia: req.body.agencia
    }
    let atualizarPessoa = await genericDAO.atualizarUmObjeto(Pessoa, json_search_pessoa, json_update_pessoa);
    if(atualizarPessoa.error) return returns.error(res, atualizarPessoa);

    // Depois atualiza usuario
    let json_search = {
    	_id: new ObjectID(req.body.usuario) // Melhor usar id_usuario para referencias de id.
    }
    let json_update = {}

    // Se uma nova senha tiver sido solicitada a testamos
    if(req.body.senha !== undefined && req.body.senha !== "") {
    	const erros_senha = validators.administrador.perfil.atualizaPerfil.errosAtualizacaoDeSenha(req);
    	if(erros_senha) return res.status(httpCodes.getValue('NaoAutorizado')).json({status:false, erros:erros_senha});
    	req.body.senha = await crypto.createHash("md5").update(req.body.senha).digest("hex");
    	
    	json_update = {
	    	dataEdicao: req.body.dataEdicao,
	    	email: req.body.email,
	    	senha: req.body.senha,
	    }
    }
    else {
    	json_update = {
    		dataEdicao: req.body.dataEdicao,
    		email: req.body.email
    	}
    }

    let atualizarUsuario = await genericDAO.atualizarUmObjeto(Usuario, json_search, json_update);
    console.log(atualizarUsuario);
    if(atualizarUsuario.error) return returns.error(res, atualizarUsuario);

    // Pegando novas informações usuáro
    const usuario = await Usuario.findOne({_id: new ObjectID(req.body.usuario)}).populate('pessoa').exec();
    
    // Apagando token antigo.
    const apagarSessao = await utilToken.destruirToken(utilToken.getTokenRequest(req));

    //Apagando informações desnecessárias 
    delete usuario.senha;
    delete usuario.recuperarSenha;

    // Gerando novo token
    const token = utilToken.gerarToken({...usuario._doc}, 720);
    await utilToken.salvarToken(token);

    /* Retorno com sucesso */
    return res.status(httpCodes.get('OK')).json({status: true, msg:responses.getValue('usuariosAtualizada'), status: true, usuario: atualizarUsuario, userInfor: usuario, token: token});
};