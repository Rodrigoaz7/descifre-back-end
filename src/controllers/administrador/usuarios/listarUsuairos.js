/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');

exports.listarUsuarios = async (req, res) => {
    const usuarios = await Usuario.find({}).populate('pessoa').exec();
    console.log(parseInt(httpCodes.getValue("OK")))
    return res.status(parseInt(httpCodes.getValue("OK"))).json({status: true, msg: responses.getValue("usuariosListados"), usuarios: usuarios});
};