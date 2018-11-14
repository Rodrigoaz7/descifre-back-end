/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatrocinadorSchema = new Schema({
    nome: String,
    email: String,
    telefone: String,
    tipo_patrocinador: String, // Tipo de empresa
    localizacao:String,
    quantia_paga: Number,
    logomarca: String, // Caminho da imagem de logomarca
    rodadas_patrocinadas: [{
        type: Schema.Types.ObjectId,
        ref: 'Rodada'
    }]
});

mongoose.model('Patrocinador', PatrocinadorSchema);