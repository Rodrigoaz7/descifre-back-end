/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Categoria = mongoose.model('Categoria');
const httpCodes = require('../../../util/httpCodes');
exports.listar = async (req, res) => {
    const categorias = await Categoria.find({});
    return res.status(httpCodes.get('OK')).json({status: true, categorias: categorias});
}
