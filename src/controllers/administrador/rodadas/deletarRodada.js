/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Rodada = mongoose.model('Rodada');
const Voucher = mongoose.model('Voucher');
const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const tokenUtil = require('../../../util/token');

exports.removerRodada = async (req, res) => {
    
    let json_delete = {
        _id: new ObjectID(req.body.id)
    }

    let deletarRodada = await genericDAO.deletarUmObjeto(Rodada, json_delete);
    
    if(deletarRodada.error) return returns.error(res, deletarRodada);

   	let vouchers = await Voucher.find({rodada: new ObjectID(req.body.id)});

   	if(vouchers.length > 0){
   		for(let i=0; i<vouchers.length; i++){
   			await Voucher.deleteOne({_id: new ObjectID(vouchers[i]._id)});
   		}
   	}
   	
    /* Retorno com sucesso */
    return res.status(httpCodes.get('OK')).json({status: true, msg:responses.getValue('rodadaDeletada')});
};
