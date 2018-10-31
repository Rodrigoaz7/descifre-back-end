/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TreinoSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    pontuacao: {
        type: Number,
        default: 0
    },
    qntdVidas: {
        type: Number,
        default: 5
    },
    dataInicioTreino: Date,
    vidaRecuperada: {
        data: Date,
        status: Boolean
    },
    questoesJogadas: [
        {
            questao:{
                type: Schema.Types.ObjectId,
                ref: 'Questao'
            },
            statusJogada: Boolean,
            pontuacao: Number
        }
    ]
});

mongoose.model('Treino', TreinoSchema);