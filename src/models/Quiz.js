/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    nomeUsuario: String,
    idRodada:{
        type: Schema.Types.ObjectId,
        ref: 'Rodada'
    },
    pontuacao: Number,
    jogadas:[{
        questao:{
            type: Schema.Types.ObjectId,
            ref: 'Questao'
        },
        status: Boolean,
        resposta: String,
        pontuacao: Number
    }],
    dataAbertura: Date,
    dataFinalizacao: Date,
});

// Paginacao
QuizSchema.plugin(mongoosePaginate);
mongoose.model('Quiz', QuizSchema);