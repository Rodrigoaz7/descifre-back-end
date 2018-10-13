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
    const limite = 20;
    var usuarios = [];
    let limite_inferior = 0;

    let pagina = req.params.pagina;
    const filtro = req.query.filtro;
   

    if(pagina > 0){
        limite_inferior = parseInt(pagina)*limite-limite;
    }

    if(filtro){
    	const pessoas = await Pessoa.find({});
    	const resultado = matchSorter(pessoas, filtro, {keys: ['nome', 'email']});
        usuarios = await Usuario.paginate(
        {
            pessoa: resultado
        },
        {
            offset: limite_inferior, limit: limite, populate: ['pessoa']
        });
    } else {
        usuarios = await Usuario.paginate({},
        {
            offset: limite_inferior, limit: limite, populate: ['pessoa'], sort: {'dataCriacao': -1}
        });
    	// usuarios = await Usuario.find({}).populate('pessoa').sort({'dataCriacao': -1}).limit(limite).exec();
    }

    return res.status(parseInt(httpCodes.getValue("OK"))).json({status: true, msg: responses.getValue("usuariosListados"), usuarios: usuarios.docs});
};