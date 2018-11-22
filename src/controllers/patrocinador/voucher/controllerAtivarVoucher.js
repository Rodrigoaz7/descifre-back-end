/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Voucher = mongoose.model('Voucher');
const utilToken = require('../../../util/token');

exports.realizarAtivacao = async (req, res) =>{
    if(!req.body.idVoucher) return res.status(404).json({status: false, msg:'Você deve informar um código de voucher'});

    const usuario = await utilToken.decoded(req.body.token);
    const buscaVoucher = await Voucher.findOne({_id:req.body.idVoucher, patrocinador: usuario._id});
    if(!buscaVoucher) return res.status(404).json({status: false, msg:'Voucher não encontrado.'});
    
    if(buscaVoucher.status){
        try {
            await Voucher.update({_id:req.body.idVoucher, patrocinador: usuario._id},{
                $set:{
                    status:false
                }
            });
            return res.status(200).json({status: true, msg:"Voucher atualizado com sucesso, usuário já pode utilizar o prêmio."});
        } catch (error) {
            return res.status(500).json({status: false, msg:'Erro ao processar o voucher'});
        }
    }else{
        return res.status(200).json({status: false, msg:"Voucher já ativado."});
    }  
};