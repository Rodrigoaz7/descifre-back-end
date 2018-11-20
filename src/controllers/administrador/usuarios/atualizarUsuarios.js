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
const imagemUtil = require('../../../util/handler_imagens/index');
const path = require('path');
const fs = require('fs');


exports.atualizarUsuarios = async (req, res) => {
    console.log(req.body)
	/* Get nos erros do formulário */
    const erros = validators.administrador.perfil.atualizaPerfil.errosCadastro(req);
    if (erros) return res.status(httpCodes.getValue('NaoAutorizado')).json({status:false, erros:erros});
    
    var url_imagem = "";
    var url_destino = "";

    // Atualizando os dados de uma pessoa, primeiramente.
    let json_search_pessoa = { _id: new ObjectID(req.body.idPessoa)}
    let json_update_pessoa = {}

    // Se for passado uma nova imagem, devemos salva-la no banco
    if(req.files){
        url_imagem = path.join(__dirname + '/../../../uploads/usuarios/'+req.body.idUsuario+'/'+req.files.foto.name);
        url_destino = path.join(__dirname + '/../../../uploads/usuarios/'+req.body.idUsuario);

        let extensao_arquivo = await imagemUtil.getExt(req.files.foto);
        if(extensao_arquivo !== ".jpg" && extensao_arquivo !== ".png" && extensao_arquivo !== ".jpeg"){
            return res.status(500).json({status: false, msg: "Extensão inválida de imagem." });
        }

        json_update_pessoa = {
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            sexo: req.body.sexo,
            banco: req.body.banco,
            conta: req.body.conta,
            agencia: req.body.agencia,
            foto: url_imagem
        }
        
        //Remove imagem guaradada anteriormente
        let user_imagem = await Pessoa.findOne({_id: new ObjectID(req.body.idPessoa)});
        if(user_imagem.foto){
            fs.unlinkSync(user_imagem.foto);
        }

    } else {
        json_update_pessoa = {
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            sexo: req.body.sexo,
            banco: req.body.banco,
            conta: req.body.conta,
            agencia: req.body.agencia
        }
    }

    let atualizarPessoa = await genericDAO.atualizarUmObjeto(Pessoa, json_search_pessoa, json_update_pessoa);
    if(atualizarPessoa.error) return returns.error(res, atualizarPessoa);

    // Se uma imagem tiver sido cadastrada, devemos armazena-la no bd
    if(url_destino !== "" && url_imagem !== ""){
        imagemUtil.createDir(url_destino, (statusDir, erroDir) => {
            if (erroDir) return res.status(500).json({status: false, msg: "Problema ao criar diretorio, tente novamente." });
            imagemUtil.saveFile(req.files.foto, url_imagem, (statusFile, erroFile) => {
                // Ao dar um res.send, um erro interno do node e disparado !!!
                if (erroFile) return console.log("ERRO");
            });
        });
    }

    // Depois atualiza usuario
    let json_search = {_id: new ObjectID(req.body.idUsuario) }
    let json_update = {}

    // Se uma nova senha tiver sido solicitada, a testamos
    if(req.body.senha !== undefined && req.body.senha !== "" && req.body.senha !== null) {
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
    if(atualizarUsuario.error) return returns.error(res, atualizarUsuario);

    // Pegando novas informações usuáro
    const usuario = await Usuario.findOne({_id: new ObjectID(req.body.idUsuario)}).populate('pessoa').exec();
    
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