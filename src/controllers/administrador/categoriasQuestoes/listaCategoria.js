/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
// const ObjectID = require('mongodb').ObjectID
const Categoria = mongoose.model('Categoria');

exports.listarCategorias = async (req, res) => {
    return await Categoria.find({});
}
