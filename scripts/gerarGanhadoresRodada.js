const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Rodada = mongoose.model('Rodada');
const Usuario = mongoose.model('Usuario');
const Transacao = mongoose.model('Transacao');
const schedule = require('node-schedule');

const gerarGanhadores = (rodada) =>{
    let jogadoresSort = rodada.jogadores.sort((a, b) => parseFloat(a.quiz.pontuacao) - parseFloat(b.quiz.pontuacao));
    let ganhadores = [];
    let contador = 0;
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
            contador++;
        }
    });
    return ganhadores;
}
exports.agendarGanhadores = async () =>{
    const dataAtual = new Date();
    // Buscando rodadas.
    const rodadas = await Rodada.find({dataFinalizacao:{$gt:dataAtual}}).populate('jogadores.quiz').exec();
    // Percorrendo rodadas
    rodadas.map((rodada, index) =>{
        // Criando data de finalização
        let dataFinalizacao = new Date(rodada.dataFinalizacao);
        
        let idRodada = rodada._id;

        schedule.scheduleJob(dataFinalizacao, function(){
            Rodada.findOne({_id: new ObjectID(idRodada)}).populate('jogadores.quiz').exec(function(err, dataRodada){
                const ganhadores = gerarGanhadores(dataRodada);
                Rodada.update({_id: new ObjectID(idRodada)},{$set:{ganhadores:ganhadores}},function(err, dataUpdate){
                    let premio = parseFloat(dataRodada.premiacao);
                    for(let i = 0; i<ganhadores.length; i++){
                        if(ganhadores[i].jogador!==undefined){
                            
                            let valorTransferir = premio*parseFloat(ganhadores[i].porcentagemPremio)/100;
                            let novaTransacao = new Transacao({
                                quantia_transferida: valorTransferir,
                                enviado_por: ganhadores[i].jogador,
                                recebido_por: ganhadores[i].jogador,
                                tipo: "premio"
                            });

                            novaTransacao.save(function(err){
                                if(err) console.log(err)
                                Usuario.update({_id: new ObjectID(dataRodada.idUsuario)},{$inc:{quantidade_cifras:valorTransferir},$set:{ganhadoresRodada:true}},function(err, data){
                                    // Dados salvos
                                });
                            });
                        }
                    }
                });
            }); 
        });
    });
};