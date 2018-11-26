const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const httpCodes = require('../../../util/httpCodes');
const Treino = mongoose.model('Treino');
const Questao = mongoose.model('Questao');
const addHours = (date, hours) => {
    return new Date(date.getTime() + hours * 60 * 60000);
};

const validatorTreino = async (req, res) =>{
    if(!req.body.idTreino) return res.status(httpCodes.getValue('NotFound')).json({status:false, msg:"Você precisa enviar um id do treino."});

    if(!req.body.idUsuario) return res.status(httpCodes.getValue('NotFound')).json({status:false, msg:"Você precisa enviar um id do usuário."});

    if(!req.body.idQuestao) return res.status(httpCodes.getValue('NotFound')).json({status:false, msg:"Você precisa enviar um id do usuário."});

    if(!req.body.respostaQuestao) return res.status(httpCodes.getValue('NotFound')).json({status:false, msg:"Você precisa enviar um id do usuário."});
};

exports.processarQuestao = async (req, res) => {
    validatorTreino(req, res);
    let buscarTreino;

    try {
        buscarTreino = await Treino.findOne({_id: req.body.idTreino});
    } catch (error) {
        return res.status(httpCodes.getValue('ServerErro')).json({status:false, msg:"Erro de processamento interno: id do treino não é válido."});
    } 
    
    if(String(buscarTreino.usuario)!==String(req.body.idUsuario)) return res.status(httpCodes.getValue('ServerErro')).json({status:false, msg:"Erro de processamento interno: id do usuário não está associado ao treino."});

    if(!buscarTreino.vidaRecuperada.status) return res.status(httpCodes.getValue('OK')).json({status:false, msg:"Você não tem vidas suficientes para jogar."});

    let buscarQuestao;

    try {
        buscarQuestao = await Questao.findOne({_id: req.body.idQuestao});
    } catch (error) {
        return res.status(httpCodes.getValue('ServerErro')).json({status:false, msg:"Erro de processamento interno: id do treino não é válido."});
    }

    if(String(req.body.respostaQuestao) === "Pular"){
        await Treino.update({_id:req.body.idTreino},
            {
                // $inc:{
                //     pontuacao: -1
                // },
                $push:{
                    questoesJogadas:{
                        questao: req.body.idQuestao,
                        statusJogada: false,
                        pontuacao: 0
                    }
                }
            }
        );

        let treino = await Treino.findOne({_id: new ObjectID(req.body.idTreino)});
        delete treino['questoesJogadas'];

        return res.status(httpCodes.getValue('OK')).json({status:true, msg:"Usuário pulou a questão", 
            correta: buscarQuestao.corretaTexto, 
            treino: treino});
    }   

    if(String(buscarQuestao.corretaTexto) !== String(req.body.respostaQuestao)){
        await Treino.update({_id:req.body.idTreino},
            {
                $inc:{
                    qntdVidas: -1,
                    pontuacao: -2
                },
                $push:{
                    questoesJogadas:{
                        questao: req.body.idQuestao,
                        statusJogada: false,
                        pontuacao: -2
                    }
                }
            }
        );
        if(buscarTreino.qntdVidas-1==0){
            let novaData = new Date();
            novaData = addHours(novaData,1);
            
            await Treino.update({_id:req.body.idTreino},
                {
                    $set:{
                        vidaRecuperada: {
                            data: novaData,
                            status: false
                        }
                    }
                }
            ); 
        }

        let treino = await Treino.findOne({_id: new ObjectID(req.body.idTreino)});
        delete treino['questoesJogadas'];

        return res.status(httpCodes.getValue('OK')).json({status:true, msg:"Usuário errou a questão", 
            correta: buscarQuestao.corretaTexto, 
            treino: treino });
    }

    if(String(buscarQuestao.corretaTexto) === String(req.body.respostaQuestao)){
        await Treino.update({_id:req.body.idTreino},
            {
                $inc:{
                    pontuacao: 10,
                    qntdVidas: 1
                },
                $push:{
                    questoesJogadas:{
                        questao: req.body.idQuestao,
                        statusJogada: true,
                        pontuacao: 10
                    }
                }
            }
        );

        let treino = await Treino.findOne({_id: new ObjectID(req.body.idTreino)});
        delete treino['questoesJogadas'];

        return res.status(httpCodes.getValue('OK')).json({status:true, msg:"Usuário acertou a questão", 
            correta: buscarQuestao.corretaTexto, 
            treino: treino });
    }

};