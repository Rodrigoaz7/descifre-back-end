/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const Pessoa = mongoose.model('Pessoa');
const Token = mongoose.model('Token');
const validators = require('../../../index');
const crypto = require('crypto');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const utilToken = require('../../../util/token');

exports.realizarCadastro = async (req, res) => {

    /* Get nos erros do formulário */
    const erros = validators.publico.autenticacao.cadastro.errosCadastro(req);
   
    if (erros) return res.status(httpCodes.get('NaoAutorizado')).json({status:false, erros:erros});

    /*
    *   Dados do usuário no ato do cadastro:
    *   req.body.nome
    *   req.body.email
    *   req.body.senha
    *   req.body.termos
    */

    /* Encriptando a senha */
    req.body.senha = await crypto.createHash("md5").update(req.body.senha).digest("hex");

    /* Criando um novo objeto Pessoa */
    let novaPessoa = new Pessoa({
        nome: req.body.nome,
        email: req.body.email
    });

    /* Salvando uma pessoa no banco se ocorrer tudo bem temos um retorno dos dados se não um null */
    let salvarPessoa = await genericDAO.salvar(novaPessoa);

    if(salvarPessoa.error) return returns.error(res, salvarPessoa);
    
    /* Criando um novo objeto Usuario */
    let novoUsuario = new Usuario({
        pessoa: novaPessoa._id,
        email: novaPessoa.email,
        permissoes: ['Public'],
        senha: req.body.senha,
    });

    /* Salvando um usuário no banco se ocorrer tudo bem temos um retorno dos dados se não um null */
    let salvarUsuario = await genericDAO.salvar(novoUsuario);

    if(salvarPessoa.error) returns.returnError(res, salvarUsuario);
    
    let usuarioToken = {
        idUsuario: salvarUsuario._id,
        idPessoa: salvarPessoa._id,
        nome: salvarPessoa.nome,
        email: salvarPessoa.email,
        permissoes: salvarUsuario.permissoes
    };

    const token = utilToken.gerarToken(usuarioToken, 360);
    
    let novoToken = new Token({token: token});

    let salvarToken = genericDAO.salvar(novoToken);

    if(salvarToken.error) returns.returnError(res, salvarToken);

    /* Retorno com sucesso */
    return res.status(httpCodes.get('OK')).json({status: true, msg:responses.getValue('usuarioCriado'), token: token, usuario: usuarioToken});
};