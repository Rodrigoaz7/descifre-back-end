/*
    Autor: Marcus Dantass
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const httpCodes = require('../../../util/httpCodes');
const Indicacao = mongoose.model('Indicacao');

exports.realizarBusca = async (req, res) =>{
	const limite = 10;
	let limite_inferior = 0;

	if(req.params.pagina > 0){
		limite_inferior = parseInt(req.params.pagina)*limite-limite;	
	}
    
    if(req.params.idUsuario == undefined) return res.status(httpCodes.getValue('NotFound')).json({status: false, erros:[{msg:"Você precisa passar um id de usuário."}]});
    
    let indicacoes;
    
    try {
        // indicacoes = await Indicacao.find({idUsuarioQueIndincou: new ObjectID(req.params.idUsuario)}).populate('idUsuarioQueIndincou').populate('idUsuarioIndicado');
    	indicacoes = await Indicacao.paginate(
    		{idUsuarioQueIndincou: new ObjectID(req.params.idUsuario)},
    		{offset: limite_inferior, limit: limite, populate: ['idUsuarioQueIndincou', 'idUsuarioIndicado']}
    	);
    } catch (error) {
        return res.status(httpCodes.getValue('ServerErro')).json({status: false, erros:[{msg:"Erro de processamento interno."}]});
    }
    
    return res.status(httpCodes.getValue('OK')).json({status:true, indicacoes: indicacoes.docs});
}