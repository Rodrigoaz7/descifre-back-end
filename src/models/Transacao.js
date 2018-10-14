/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate')
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

// Paginacao
TransacaoSchema.plugin(mongoosePaginate);
mongoose.model('Transacao', TransacaoSchema);