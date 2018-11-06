/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoucherSchema = new Schema({
    premio: String,
    codigoVoucher: String,
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    patrocinador:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    rodada:{
        type: Schema.Types.ObjectId,
        ref: 'Rodada'
    },
    status:{
        type: Boolean,
        default: true
    }
});

mongoose.model('Voucher', VoucherSchema);