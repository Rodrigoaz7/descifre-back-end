/*
    Autor: Rodrigo Azevedo
*/
const mongoose = require('mongoose');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const Treino = mongoose.model('Treino');
const mongoosePaginate = require('mongoose-paginate');

exports.getRankingTreino = async (req, res) => {

    const limite = 10;
    let limite_inferior = 0;
    let pagina = req.params.pagina;
    let colocacao = 0;
    const idUsuario = req.params.idUsuario;

    if(pagina > 0){
        limite_inferior = parseInt(pagina)*limite-limite;
    }

    // Tive que fazer uma consulta geral para capturar colocacao do usuario
    // Pois, o pagination não me darah todos os usuarios
    let lista_total = await Treino.find();
    let lista_ranking = await Treino.paginate({},
    {
        offset: limite_inferior, limit: limite, populate: ['usuario'], sort: {'pontuacao': -1}
    });

    if(lista_ranking.error) return returns.error(res, lista_ranking);

    delete lista_ranking['questoesJogadas'];
    delete lista_ranking['vidaRecuperada'];

    colocacao = await lista_total.findIndex(findTreino => findTreino.usuario._id==idUsuario);

    return res.status(httpCodes.get('OK')).json({status: true, 
        msg:responses.getValue('dadosListados'), 
        ranking: lista_ranking.docs,
        colocacao: colocacao});
    

    
    
}