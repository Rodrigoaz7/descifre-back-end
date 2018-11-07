/*
    Autor: Marcus Dantas
*/

const mongoose = require('mongoose');
const Rodada = mongoose.model('Rodada');
const Voucher = mongoose.model('Voucher');
const Usuario = mongoose.model('Usuario');
const randomstring = require("randomstring");
const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const tokenUtil = require('../../../util/token');
const gerarGanhadoresRodada = require('../../../../scripts/gerarGanhadoresRodada');

exports.cadastrarRodada = async (req, res) => {
    
    /* Get nos erros do formulário */
    const erros = validators.administrador.rodadas.criarRodada.errosCadastro(req);
   
    if (erros) return res.status(httpCodes.getValue('ReqInvalida')).json({status:false, erros:erros});
    
    let premiacaoVoucher = Boolean(req.body.premiacaoVoucher);
    
    let patrocinador = [];

    if(premiacaoVoucher){
        patrocinador = await Usuario.findOne({email: req.body.emailPatrocinador});
        
        let errosPatrocinador = [{
            msg: "E-mail patrocinador inválido."
        }];

        if(!patrocinador){
            return res.status(httpCodes.getValue('ReqInvalida')).json({status:false, erros:errosPatrocinador});
        }
    }
    
    let informacaoDecodificada = await tokenUtil.decoded(tokenUtil.getTokenRequest(req));
    
    req.body.abertoPor = informacaoDecodificada._id;
    if(premiacaoVoucher){
        delete req.body.premiacao;
        req.body.pagamentoEmCifras = false;
        req.body.premioVoucher = req.body.premiacaoTextoVoucher;
    }
    
    let novaRodada = new Rodada(req.body);

    let salvarRodada = await genericDAO.salvar(novaRodada);
    
    if(salvarRodada.error) return returns.error(res, salvarRodada);

    if(premiacaoVoucher){
        for(let i = 0; i<req.body.ganhadores.length; i++){
            const codigoVoucher = randomstring.generate(6);
            const novoVoucher = new Voucher({
                premio: req.body.premiacaoTextoVoucher,
                codigoVoucher: codigoVoucher,
                rodada: novaRodada._id,
                patrocinador: patrocinador._id
            });
            await novoVoucher.save();
        }
        req.body.premioVoucher = req.body.premiacaoTextoVoucher;
    }
    
    // Criando job para finalizar rodada.
    gerarGanhadoresRodada.criarJobFinalizarRodada(novaRodada.dataFinalizacao, novaRodada._id);
    
    /* Retorno com sucesso */
    return res.status(httpCodes.get('Criado')).json({status: true, msg:responses.getValue('rodadaCriada')});
};
