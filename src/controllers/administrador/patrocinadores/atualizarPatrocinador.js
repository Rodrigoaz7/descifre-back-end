/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Patrocinador = mongoose.model('Patrocinador');
const Token = mongoose.model('Token');
const validators = require('../../../index');
const crypto = require('crypto');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const utilToken = require('../../../util/token');
const imagemUtil = require('../../../util/handler_imagens/index');
const path = require('path');

exports.atualizarPatrocinador = async (req, res) => {
    
     /* Get nos erros do formulário */
    const erros = validators.administrador.patrocinadores.criarPatrocinador.errosCadastro(req);
    if (erros) return res.status(httpCodes.getValue('NaoAutorizado')).json({status:false, erros:erros});
    
    var url_imagem = "";
    var url_destino = "";

    let json_search = {
        _id: new ObjectID(req.body.id)
    }

    if(req.files){
        url_imagem = path.join(__dirname + '/../../../uploads/patrocinadores/'+req.body.id+'/'+req.files.logomarca.name);
        url_destino = path.join(__dirname + '/../../../uploads/patrocinadores/'+req.body.id);

        let extensao_arquivo = await imagemUtil.getExt(req.files.logomarca);
        if(extensao_arquivo !== ".jpg" && extensao_arquivo !== ".png" && extensao_arquivo !== ".jpeg"){
            return res.status(500).json({status: false, msg: "Extensão inválida de imagem." });
        }
    } 

    let json_update = {
        nome: req.body.nome,
        email: req.body.email,
        telefone: req.body.telefone,
        logomarca: url_imagem,
        rodadas_patrocinadas: req.body.rodadas_patrocinadas,
        tipo_patrocinador: req.body.tipo_patrocinador,
        quantia_paga: req.body.quantia_paga
    }

    let atualizarPatrocinador = await genericDAO.atualizarUmObjeto(Patrocinador, json_search, json_update);
    if(atualizarPatrocinador.error) return returns.error(res, atualizarPatrocinador);

    if(url_destino !== "" && url_imagem !== ""){
        imagemUtil.createDir(url_destino, (statusDir, erroDir) => {
            if (erroDir) return res.status(500).json({status: false, msg: "Problema ao criar diretorio, tente novamente." });
            imagemUtil.saveFile(req.files.logomarca, url_imagem, (statusFile, erroFile) => {
                // Ao dar um res.send, um erro interno do node e disparado !!!
                if (erroFile) return console.log("ERRO");
            });
        });
    }

    /* Retorno com sucesso */
    return res.status(httpCodes.get('Criado')).json({status: true, msg: atualizarPatrocinador});
}
