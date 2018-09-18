/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransacaoSchema = new Schema({
    quantia_transferida: Number,
    data_transferencia: Date,
    enviado_por: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    recebido_por: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    tipo: String //Tipo pode ser 'saque', 'compra' ou 'transferencia'	
});

mongoose.model('Transacao', TransacaoSchema);