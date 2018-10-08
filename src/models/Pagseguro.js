/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PagseguroSchema = new Schema({
    status: String,
    codigo: String
});

mongoose.model('Pagseguro', PagseguroSchema);