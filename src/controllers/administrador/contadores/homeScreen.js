const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const Questao = mongoose.model('Questao');
const Rodada = mongoose.model('Rodada');
const Transacao = mongoose.model('Transacao');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');

exports.contadorHomeScreen = async (req, res) =>{

    // Capturo a data de hoje
    let date_today = new Date();
    // Seto as horas/minutos/segundos/ms em zero
    date_today.setHours(0,0,0,0);
    // Resolvendo problema das tres horas a mais
    // date_today = new Date(date_today.getTime() - 3*60*60000);
    // Capturo dia da semana
    let day = date_today.getDay();
    /*
        0 - DOMINGO
        1 - SEGUNDA
        2 - TERCA
        3 - QUARTA
        4 - QUINTA
        5 - SEXTA
        6 - SÁBADO
    */
    // Capturo data do primeiro dia da semana, no caso, domingo
    let data_iterator = date_today;
    if(day > 0) data_iterator = new Date(date_today.getTime() - 1*parseInt(day)*24*60*60000);

    var contadorUsuariosSemana = [];
    var contadorCifrasSemana = [];

    for(let i=0; i<7; i++){
        let usuarios = await Usuario.count({
            dataCriacao: { 
                $gt: data_iterator, $lt:(new Date(new Date(data_iterator).getTime() + 1*24*60*60000))
            }
        });
        contadorUsuariosSemana[i] = usuarios;

        let transacoes = await Transacao.find({
            data_transferencia: { 
                $gt: data_iterator, $lt:(new Date(new Date(data_iterator).getTime() + 1*24*60*60000))
            }
        });
        if(transacoes.length > 0) {
            contadorCifrasSemana[i] = 0;
            for(let j=0; j<transacoes.length; j++){
                contadorCifrasSemana[i] += transacoes[j].quantia_transferida;
            }
        } else {
            contadorCifrasSemana[i] = 0;
        }

        data_iterator = new Date(data_iterator.getTime() + 1*24*60*60000);
    }

    /* Populando os contadores */
    const qntdUsuarios = await Usuario.count({});
    const qntdQuestao = await Questao.count({});
    const qntdRodada = await Rodada.count({});
    const qntdTransacoes = await Transacao.count({});
    const qntdRequisicoesSaque = await Transacao.count({tipo:"saque", status:0})

    let data = {
        status: true,
        numeros:{//qntdCifra,
            qntdQuestao,
            qntdRodada,
            qntdUsuarios,
            qntdTransacoes,
            contadorUsuariosSemana,
            contadorCifrasSemana,
            qntdRequisicoesSaque
        }
    };

    return res.status(parseInt(httpCodes.getValue("OK"))).json(data);
};