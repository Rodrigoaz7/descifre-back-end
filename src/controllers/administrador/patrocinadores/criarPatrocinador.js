/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Rodada = mongoose.model('Rodada');
const Patrocinador = mongoose.model('Patrocinador');
const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const tokenUtil = require('../../../util/token');
const imagemUtil = require('../../../util/handler_imagens/index');
const path = require('path');

exports.cadastrarPatrocinador = async (req, res) => {
	/* Get nos erros do formulário */
    const erros = validators.administrador.patrocinadores.criarPatrocinador.errosCadastro(req);

    if (erros) return res.status(httpCodes.getValue('ReqInvalida')).json({status:false, erros:erros});
    let arquivoEnviado = req.files !== null;
    if((arquivoEnviado && !req.files.logomarca) || !arquivoEnviado){
        return res.status(httpCodes.getValue('ReqInvalida')).json({status:false, erros:[{msg: "Você deve fornecer uma logomarca"}]});
    }
    let novoPatrocinador = new Patrocinador(req.body);

    // capturando urls para criacao de diretorio de nova imagem
    var url_imagem = path.join(__dirname + '/../../../uploads/patrocinadores/'+novoPatrocinador._id+'/'+req.files.logomarca.name); 
    var url_destino = path.join(__dirname + '/../../../uploads/patrocinadores/'+novoPatrocinador._id);

    let extensao_arquivo = await imagemUtil.getExt(req.files.logomarca);
    if(extensao_arquivo !== ".jpg" && extensao_arquivo !== ".png" && extensao_arquivo !== ".jpeg"){
        return res.status(500).json({status: false, msg: "Extensão inválida de imagem." });
    }

    novoPatrocinador.logomarca = url_imagem;
    let salvarPatrocinador = genericDAO.salvar(novoPatrocinador);
    if(salvarPatrocinador.error) return returns.error(res, salvarPatrocinador);

    imagemUtil.createDir(url_destino, (statusDir, erroDir) => {
        if (erroDir) return res.status(500).json({status: false, msg: "Problema ao criar diretorio, tente novamente." });
        imagemUtil.saveFile(req.files.logomarca, url_imagem, (statusFile, erroFile) => {
            // Ao dar um res.send, um erro interno do node e disparado !!!
            if (erroFile) return console.log("ERRO");
        });
    });

    /* Retorno com sucesso */
    return res.status(httpCodes.get('Criado')).json({status: true, msg:salvarPatrocinador});
};
