const mongoose = require('mongoose');
const Voucher = mongoose.model('Voucher');
exports.verVouchers = async (req, res) => {
    if(!req.params.idUsuario) return res.status(404).json({status:false, msg:'Nenhum id de usuario foi informada.'});
    let vouchersUsuario;
    try {
        vouchersUsuario = await Voucher.find({usuario:req.params.idUsuario}).populate('patrocinador');        
    } catch (error) {
        return res.status(500).json({status:false, msg:'Erro de processamento interno.'});
    }
    return res.status(200).json({status:true, msg:'Requisicação concluídia', vouchersUsuario: vouchersUsuario});
    
};