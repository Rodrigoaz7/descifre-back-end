/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const QuestaoSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    enunciado: String,
    alternativas: [{
        descricao: String
    }],
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    correta: Number,
    corretaTexto: String,
    pontuacao: Number,
    dataCriacao: Date,
    // Campos para estabelecimento de dificuldade de questoes
    quantidadeAcertos: Number,
    quantidadeErros: Number,
    quantidadePulos: Number,
    quantidadeSoma: Number
});

// Pagination para este modelo do mongoose
QuestaoSchema.plugin(mongoosePaginate);
mongoose.model('Questao', QuestaoSchema);