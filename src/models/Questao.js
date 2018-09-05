/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestaoSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    enunciado: String,
    alternativas: [String],
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    correta: Number,
    pontuacao: Number,
    dataCriacao: Date
});

mongoose.model('Questao', QuestaoSchema);