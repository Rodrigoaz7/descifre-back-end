/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PessoaSchema = new Schema({
    nome: String,
    email: {
        type: String,
        unique: true
    },
    telefone: String,
    conta: String,
    agencia: String,
    sexo: String
});


mongoose.model('Pessoa', PessoaSchema);