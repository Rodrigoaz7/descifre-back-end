/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PagseguroSchema = new Schema({
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    idCompra: String,
    cifras: Number,
    valorPago: Number,
    statusCode: Number,
    verificado: Boolean,
    dataAbertura:{
        type: Date,
        default: new Date()
    },
    dataFinalizacao: Date,
    finalizado: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Pagseguro', PagseguroSchema);