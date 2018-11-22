/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Voucher = mongoose.model('Voucher');
const utilToken = require('../../../util/token');

exports.obterVouchers = async (req, res) =>{
    const usuario = await utilToken.decoded(req.params.token);

    const buscaVoucher = await Voucher.find({patrocinador: usuario._id, status:true}).populate('usuario', '-senha').populate({path:'usuario',populate:{path:'pessoa'}}).exec();
    
    return res.status(200).json({status: true, vouchers: buscaVoucher});
};