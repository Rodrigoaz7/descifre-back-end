/*
    Autor: Marcus Dantass
*/
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const httpCodes = require('../../../util/httpCodes');
const Treino = mongoose.model('Treino');
const addHours = (date, hours) => {
    return new Date(date.getTime() + hours * 60 * 60000);
};

exports.entrarNoTreino = async (req, res) => {
    if (!req.body.idUsuario) return res.status(httpCodes.getValue('NotFound')).json({
        status: false,
        erros: [{ msg: "Você deve passar um id de usuário para entrar no modo treino." }]
    });

    const buscaPorTreinoJaCriado = await Treino.findOne({ usuario: req.body.idUsuario });
    if (buscaPorTreinoJaCriado !== null && !buscaPorTreinoJaCriado.vidaRecuperada.status) {
        let dataVidaRecuperada = new Date(buscaPorTreinoJaCriado.vidaRecuperada.data);
        // dataVidaRecuperada = addHours(dataVidaRecuperada, 3);
        let dataAtual = new Date();
        if (dataAtual.getTime() < dataVidaRecuperada.getTime()) return res.status(httpCodes.getValue('OK')).json({ status: false, msg: 'As suas vidas ainda não foram carregadas.' });
        
        await Treino.update({ usuario: req.body.idUsuario }, {
            $set: {
                qntdVidas: 5,
                vidaRecuperada: {
                    status: true,
                    data: new Date()
                }
            }
        });
        return res.status(httpCodes.getValue('OK')).json({ status: true, msg: 'Usuáio pode iniciar o treino' });
    }
    if (buscaPorTreinoJaCriado !== null && buscaPorTreinoJaCriado.vidaRecuperada.status) return res.status(httpCodes.getValue('OK')).json({ status: true, msg: 'Usuáio pode iniciar o treino' });

    if (buscaPorTreinoJaCriado !== null && !buscaPorTreinoJaCriado.vidaRecuperada.status) return res.status(httpCodes.getValue('OK')).json({ status: false, msg: 'Usuáio não tem vida suficientes para iniciar o treino.' });


    const novoTreino = new Treino({
        usuario: req.body.idUsuario,
        dataInicioTreino: new Date(),
        vidaRecuperada: {
            data: new Date(),
            status: true
        },
        questoesJogadas: []
    });

    try {
        await novoTreino.save();
        res.status(httpCodes.getValue('OK')).json({ status: true, msg: "Treino criado com sucesso." });
    } catch (err) {
        res.status(httpCodes.getValue('ServerErro')).json({ status: false, msg: "Erro de processamento interno." })
    }
}