/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
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

// Paginacao
IndicacaoSchema.plugin(mongoosePaginate);
mongoose.model('Indicacao', IndicacaoSchema);