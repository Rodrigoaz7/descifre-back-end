/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RodadaSchema = new Schema({
    titulo: String,
    dataAbertura: Date,
    dataFinalizacao: Date,
    duracao: Number,
    premiacao: Number,
    jogadores:[{
        quiz:{
            type: Schema.Types.ObjectId,
            ref: 'Quiz'
        }
    }],
    ganhadores:[{
        jogador:{
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
        },
        porcentagemPremio: Number
    }],
    abertoPor:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'  
    }
});

mongoose.model('Rodada', RodadaSchema);