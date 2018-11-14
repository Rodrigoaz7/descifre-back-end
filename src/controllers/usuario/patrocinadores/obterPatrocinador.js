const mongoose = require('mongoose');
const Patrocinador = mongoose.model('Patrocinador');
const httpCodes = require('../../../util/httpCodes');
const Rodada = mongoose.model('Rodada');
exports.obterPatrocinador = async (req, res) => {
    if(!req.params.idRodada) return res.status(httpCodes.get('NotFound')).json({status:false, msg:'Nenhuma imagem encontrada'});
    
    const buscaRodada = await Rodada.findOne({_id: req.params.idRodada});

    if(!buscaRodada) return res.status(httpCodes.get('NotFound')).json({status:false, msg:'Nenhuma imagem encontrada'});
    
    const patrocinador = await Patrocinador.findOne({email:buscaRodada.emailPatrocinador});
    
    if(!patrocinador) return res.status(httpCodes.get('NotFound')).json({status:false, msg:'Patrocinador não encontrado.'});

    return res.status(httpCodes.get('OK')).json({status:true, msg:'Patrocinador encontrado.', patrocinador: patrocinador });
};