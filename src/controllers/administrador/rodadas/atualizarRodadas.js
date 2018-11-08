/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Rodada = mongoose.model('Rodada');
const Usuario = mongoose.model('Usuario');
const Voucher = mongoose.model('Voucher');
const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const tokenUtil = require('../../../util/token');
const randomstring = require("randomstring");

exports.atualizarRodada = async (req, res) => {
	/* Get nos erros do formulário */
    const erros = validators.administrador.rodadas.criarRodada.errosCadastro(req);
   
    if (erros) return res.status(httpCodes.getValue('ReqInvalida')).json({status:false, erros:erros});
    
    let informacaoDecodificada = await tokenUtil.decoded(tokenUtil.getTokenRequest(req));
    
    req.body.abertoPor = informacaoDecodificada._id;

    let premiacaoVoucher = Boolean(req.body.premiacaoVoucher);
    
    let patrocinador = [];

    if(premiacaoVoucher){
        delete req.body.premiacao;
        req.body.pagamentoEmCifras = false;
        req.body.premioVoucher = req.body.premiacaoTextoVoucher;

        patrocinador = await Usuario.findOne({email: req.body.emailPatrocinador});

        let errosPatrocinador = [{
            msg: "E-mail patrocinador inválido."
        }];

        if(!patrocinador){
            return res.status(httpCodes.getValue('ReqInvalida')).json({status:false, erros:errosPatrocinador});
        }

    } else {
        delete req.body.premiacaoTextoVoucher;
        delete req.body.emailPatrocinador;
        req.body.pagamentoEmCifras = true;
    }

    let novaRodada = {
        duracao: req.body.duracao,
        taxa_entrada: req.body.taxa_entrada,
        titulo: req.body.titulo,
        dataAbertura: req.body.dataAbertura,
        dataFinalizacao: req.body.dataFinalizacao,
        ganhadores: req.body.ganhadores,
        pagamentoEmCifras: req.body.pagamentoEmCifras,
        premiacao: req.body.premiacao || "",
        premioVoucher: req.body.premiacaoTextoVoucher || "",
        emailPatrocinador: req.body.emailPatrocinador || ""
    }

    let get_rodada = { _id: new ObjectID(req.body.id) }
    let salvarRodada = await genericDAO.atualizarUmObjeto(Rodada, get_rodada, novaRodada);

    if(salvarRodada.error) return returns.error(res, salvarRodada);

    // Se Houverem vouchers associados a rodada, entao atualizamos todos eles
    if(premiacaoVoucher) {

        let vouchers = await Voucher.find({rodada: new ObjectID(req.body.id)});

        if(vouchers && vouchers.length > 0) {
            vouchers.map(async(voucher, index) => {
                let get_voucher = {_id: new ObjectID(voucher._id)}
                let novo_voucher = {
                    patrocinador: patrocinador._id,
                    premio: req.body.premiacaoTextoVoucher,
                    status: true
                }

                let salvar_voucher = await genericDAO.atualizarUmObjeto(Voucher, get_voucher, novo_voucher);
                if(salvar_voucher.error) return returns.error(res, salvar_voucher);                
            });
        } else {

            const codigoVoucher = randomstring.generate(6);
            const novoVoucher = new Voucher({
                premio: req.body.premiacaoTextoVoucher,
                codigoVoucher: codigoVoucher,
                rodada: req.body.id,
                patrocinador: patrocinador._id
            });
            await novoVoucher.save();
        }
    }

    /* Retorno com sucesso */
    return res.status(httpCodes.get('Criado')).json({status: true, msg:responses.getValue('rodadaCriada')});
};
