/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IndicacaoSchema = new Schema({
    idUsuarioQueIndincou: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    idUsuarioIndicado:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    valorGanho: Number,
    status: Boolean
});

mongoose.model('Indicacao', IndicacaoSchema);