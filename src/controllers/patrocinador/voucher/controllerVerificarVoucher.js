/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Voucher = mongoose.model('Voucher');
const utilToken = require('../../../util/token');

exports.realizarVerificacao = async (req, res) =>{
    if(!req.params.codigoVoucher) return res.status(404).json({status: false, erros:[{msg:'Você deve informar um código de voucher'}]});
    
    const usuario = await utilToken.decoded(req.params.token);
    
    const buscarVoucher = await Voucher.findOne({codigoVoucher:req.params.codigoVoucher, patrocinador: usuario._id});
    
    if(!buscarVoucher) return res.status(404).json({status: false, erros:[{msg:'Nenhum voucher foi encontrado.'}]});

    if(buscarVoucher.status) return res.status(200).json({status: true, voucher: buscarVoucher, msg:"O voucher pode ser utilizado"});
    else return res.status(200).json({status: false, voucher: buscarVoucher, msg:"O voucher já foi utilizado"});
};