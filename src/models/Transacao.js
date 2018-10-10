/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransacaoSchema = new Schema({
    quantia_transferida: Number,
    data_transferencia: {
        type: Date,
        default: new Date()
    },
    enviado_por: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    recebido_por: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    tipo: String, //Tipo pode ser 'saque', 'compra', 'transferencia', "premio"	
    status: Number, //status definido num util chamado statusCode
    hashCompra: String
});

mongoose.model('Transacao', TransacaoSchema);