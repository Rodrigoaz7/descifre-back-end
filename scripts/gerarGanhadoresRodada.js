const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Rodada = mongoose.model('Rodada');
const Usuario = mongoose.model('Usuario');
const Voucher = mongoose.model('Voucher');
const Transacao = mongoose.model('Transacao');
const schedule = require('node-schedule');
const PushNotifications = require('pusher-push-notifications-node');
const variables = require('../config/variables');
const gerarGanhadores = (rodada, vouchers=null) => {
    let jogadoresSort = rodada.jogadores.sort((a, b) => parseFloat(a.quiz.pontuacao) - parseFloat(b.quiz.pontuacao));
    let ganhadores = [];
    let contador = 0;
    jogadoresSort = jogadoresSort.reverse();
    
    rodada.ganhadores.map(ganhador => {
        if (jogadoresSort.length > 0) {
            let data;
            if (jogadoresSort[contador] !== undefined) {
                if(rodada.pagamentoEmCifras){
                    data = {
                        _id: ganhador._id,
                        porcentagemPremio: ganhador.porcentagemPremio,
                        jogador: jogadoresSort[contador].quiz.idUsuario
                    }
                }else{
                    data = {
                        _id: ganhador._id,
                        porcentagemPremio: ganhador.porcentagemPremio,
                        jogador: jogadoresSort[contador].quiz.idUsuario,
                        voucher: vouchers[contador]._id
                    }
                }
            } else {
                if(rodada.pagamentoEmCifras){
                    data = {
                        _id: ganhador._id,
                        porcentagemPremio: ganhador.porcentagemPremio
                    }
                }else{
                    data = {
                        _id: ganhador._id,
                        porcentagemPremio: ganhador.porcentagemPremio,
                        voucher: vouchers[contador]._id
                    }
                } 
            }
            ganhadores.push(data);
            contador++;
        }
    });
    return ganhadores;
}

const criarJobFinalizarRodada = exports.criarJobFinalizarRodada = async (dataFinalizacao, idRodada) => {
    schedule.scheduleJob(dataFinalizacao, async () => {
        const rodadaQueSeraFinalizada = await Rodada.findOne({ _id: new ObjectID(idRodada) }).populate('jogadores.quiz').exec();
        const vouchers = await Voucher.find({rodada:rodadaQueSeraFinalizada._id});
        let pushNotifications = new PushNotifications({
            instanceId: variables.instanceId,
            secretKey: variables.secretKey
        });
        if(rodadaQueSeraFinalizada.pagamentoEmCifras){
            const ganhadoresDaRodada = gerarGanhadores(rodadaQueSeraFinalizada, vouchers);
        
            console.log('Ganhadores da rodada:');
            console.log(ganhadoresDaRodada);
            
            await Rodada.update({ _id: new ObjectID(idRodada) }, { $set: { ganhadores: ganhadoresDaRodada } });
            const premioRodada = parseFloat(rodadaQueSeraFinalizada.premiacao);
            ganhadoresDaRodada.map(async (ganhador, index) => {
                if (ganhador.jogador !== undefined) {
                    let valorTransferir = premioRodada * parseFloat(ganhador.porcentagemPremio) / 100;
                    let novaTransacao = new Transacao({
                        quantia_transferida: parseFloat(valorTransferir),
                        enviado_por: ganhador.jogador,
                        recebido_por: ganhador.jogador,
                        tipo: "premio",
                        status: 1
                    });
                    console.log(`Transação feita para: ${ganhador.jogador}`);
                    await novaTransacao.save();
                    await Usuario.update({ _id: new ObjectID(ganhador.jogador) }, { $inc: { quantidade_cifras: valorTransferir } });
                    await Usuario.update({ _id: new ObjectID(ganhador.jogador) }, { $set: { ganhadoresRodada: true } });  
                }
            });
            if(variables.ambiente!=='dev'){
                await pushNotifications.publish(
                    ['hello'],
                    {
                        fcm: {
                            notification: {
                                title: 'Atualização de rodadas',
                                body: 'Olá, tudo bem? Uma rodada acabou de ser finalizada e já estamos com outra aberta. Corre lá e veja sua classificação, você pode ter a ganhado algumas cifras :)'
                            }
                        }
                    }
                );
            }
            
            return;
        }else{
            const ganhadoresDaRodada = gerarGanhadores(rodadaQueSeraFinalizada, vouchers);
        
            console.log('Ganhadores da rodada:');
            console.log(ganhadoresDaRodada); 
            ganhadoresDaRodada.map(async ganhador => {
                if(ganhador.voucher!==undefined){
                    await Voucher.update({_id: ganhador.voucher},{$set:{usuario:ganhador.jogador}});
                }
            })
            await Rodada.update({ _id: new ObjectID(idRodada) }, { $set: { ganhadores: ganhadoresDaRodada } });
            if(variables.ambiente!=='dev'){
                await pushNotifications.publish(
                    ['hello'],
                    {
                        fcm: {
                            notification: {
                                title: 'Atualização de rodadas',
                                body: 'Olá, tudo bem? Uma rodada acabou de ser finalizada e já estamos com outra aberta. Corre lá e veja sua classificação, você pode ter a ganhado algumas cifras :)'
                            }
                        }
                    }
                );
            }
            return;
        }
        
    });
};

exports.agendarGanhadores = async () => {
    const dataAtual = new Date();
    const rodadas = await Rodada.find({ dataFinalizacao: { $gt: dataAtual } }).populate('jogadores.quiz').exec();

    // Percorrendo rodadas
    rodadas.map(async (rodada, index) => {
        // Criando data de finalização
        let dataFinalizacao = new Date(rodada.dataFinalizacao);

        let idRodada = rodada._id;
        criarJobFinalizarRodada(dataFinalizacao,idRodada);
        return;
    });
    return;
};