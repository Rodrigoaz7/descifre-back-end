/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriaSchema = new Schema({
    nome: {
    	type: String,
    	unique: true
    }
});

mongoose.model('Categoria', CategoriaSchema);