/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Rodada = mongoose.model('Rodada');
const Usuario = mongoose.model('Usuario');
const Transacao = mongoose.model('Transacao');
const validators = require('../../../index');
const returns = require('../../../util/returns');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');
const genericDAO = require('../../../util/genericDAO');
const tokenUtil = require('../../../util/token');
const schedule = require('node-schedule');
const gerarGanhadores = (rodada) =>{
    let jogadoresSort = rodada.jogadores.sort((a, b) => parseFloat(a.quiz.pontuacao) - parseFloat(b.quiz.pontuacao));
    let ganhadores = [];
    let contador = rodada.ganhadores.length-1;
    rodada.ganhadores.map(ganhador => {
        if(jogadoresSort.length>0){
            let data;
            if(jogadoresSort[contador]!==undefined){
                data = {
                    _id: ganhador._id,
                    porcentagemPremio: ganhador.porcentagemPremio,
                    jogador: jogadoresSort[contador].quiz.idUsuario 
                }
            }else{
                data = {
                    _id: ganhador._id,
                    porcentagemPremio: ganhador.porcentagemPremio
                }
            }
            ganhadores.push(data);
            contador--;
        }
    });
    return ganhadores;
}

const gerarJob = (rodada) => {
    let dataFinalizacao = new Date(rodada.dataFinalizacao);
    let idRodada = rodada._id;
    schedule.scheduleJob(dataFinalizacao, async function(){
        Rodada.findOne({_id: new ObjectID(idRodada)}).populate('jogadores.quiz').exec(async function(err, dataRodada){
            const ganhadores = gerarGanhadores(dataRodada);
            Rodada.update({_id: new ObjectID(idRodada)},{$set:{ganhadores:ganhadores}},async function(err, dataUpdate){
                let premio = parseFloat(dataRodada.premiacao);
                for(let i = 0; i<ganhadores.length; i++){
                    if(ganhadores[i].jogador!==undefined){
                        let valorTransferir = premio*parseFloat(ganhadores[i].porcentagemPremio)/100;
                        let novaTransacao = new Transacao({
                            quantia_transferida: valorTransferir,
                            enviado_por: ganhadores[i].jogador,
                            recebido_por: ganhadores[i].jogador,
                            tipo: "premio",
                            data_transferencia: new Date()
                        });
                        await novaTransacao.save();
                        await Usuario.update({_id: new ObjectID(ganhadores[i].jogador)},{$inc:{quantidade_cifras:valorTransferir}}); 
                        await Usuario.update({_id: new ObjectID(ganhadores[i].jogador)},{$set:{ganhadoresRodada:true}});
                    }
                }
            });
        }); 
    });
}
exports.cadastrarRodada = async (req, res) => {
	/* Get nos erros do formulário */
    const erros = validators.administrador.rodadas.criarRodada.errosCadastro(req);
   
    if (erros) return res.status(httpCodes.getValue('ReqInvalida')).json({status:false, erros:erros});
    
    let informacaoDecodificada = await tokenUtil.decoded(tokenUtil.getTokenRequest(req));
    
    req.body.abertoPor = informacaoDecodificada._id;

    let novaRodada = new Rodada(req.body);

    let salvarRodada = await genericDAO.salvar(novaRodada);

    if(salvarRodada.error) return returns.error(res, salvarRodada);

    // Criando job para finalizar rodada.
    gerarJob(salvarRodada);
    
    /* Retorno com sucesso */
    return res.status(httpCodes.get('Criado')).json({status: true, msg:responses.getValue('rodadaCriada')});
};
