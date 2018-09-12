const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const Questao = mongoose.model('Questao');
const Rodada = mongoose.model('Rodada');
//const Cifra = mongoose.model('Cifra');
const httpCodes = require('../../../util/httpCodes');
const responses = require('../../../util/responses');

exports.contadorHomeScreen = async (req, res) =>{

    /* Populando os contadores */
    const qntdUsuarios = await Usuario.count({});
    const qntdQuestao = await Questao.count({});
    const qntdRodada = await Rodada.count({});
    //const qntdCifra = await Cifra.count({});

    let data = {
        status: true,
        numeros:{//qntdCifra,
            qntdQuestao,
            qntdRodada,
            qntdUsuarios
        }
    };

    return res.status(parseInt(httpCodes.getValue("OK"))).json(data);
};