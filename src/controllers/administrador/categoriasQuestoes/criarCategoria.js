/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Categoria = mongoose.model('Categoria');
const Token = mongoose.model('Token');
const validators = require('../../../index');
const crypto = require('crypto');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const utilToken = require('../../../util/token');

exports.cadastrarCategoria = async (req, res) => {

	/* Testa se categoria ja existe no banco */
    let testa_existencia = await Categoria.find({nome: req.body.categoria.toUpperCase()})
    
    if(testa_existencia.length == 0) {
        let novaCategoria = new Categoria({
            nome: req.body.categoria.toUpperCase()
        });
        let salvarCategoria = await genericDAO.salvar(novaCategoria);
        
        if(salvarCategoria.error) return returns.error(res, salvarCategoria);
        return salvarCategoria._id;
    }
    else {
        return testa_existencia[0]._id;
    }
}