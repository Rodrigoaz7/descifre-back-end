/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const Pessoa = mongoose.model('Pessoa');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const matchSorter = require('match-sorter');

exports.listarUsuarios = async (req, res) => {
    const limite = parseInt(req.params.limite);
    const filtro = req.query.filtro;
    var usuarios = [];
    if(filtro){
    	const pessoas = await Pessoa.find({});
    	const resultado = matchSorter(pessoas, filtro, {keys: ['nome', 'email']});
    	usuarios = await Usuario.find({pessoa: resultado}).populate('pessoa').limit(limite).exec();
    } else {
    	usuarios = await Usuario.find({}).populate('pessoa').sort({'dataCriacao': -1}).limit(limite).exec();
    }
    console.log(parseInt(httpCodes.getValue("OK")))
    return res.status(parseInt(httpCodes.getValue("OK"))).json({status: true, msg: responses.getValue("usuariosListados"), usuarios: usuarios});
};