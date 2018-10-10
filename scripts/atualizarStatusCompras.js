const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID
const Pagseguro = mongoose.model('Pagseguro');
const request = require("request");
const variables = require('../config/variables');
const convert = require('xml-js');
const Usuario = mongoose.model('Usuario');
const Transacao = mongoose.model('Transacao');
const schedule = require('node-schedule');
const requestAsync = (options) => {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) reject(error);
            else resolve(body);
        })
    });
}

exports.realizarAtualizacao = async () => {
    schedule.scheduleJob('30 * * * *', async () => {
        const transacoesSemConfirmacao = await Pagseguro.find({ verificado: false }).sort('dataAbertura').exec();
        const transacoesConfirmadas = await Pagseguro.find({ finalizado: false, verificado: true });

        let dataFinalizacao = new Date();
        let dataFinalizacaoString = `${dataFinalizacao.toLocaleDateString()}T${dataFinalizacao.toLocaleTimeString()}`;

        if (transacoesSemConfirmacao.length > 0) {
            let dataTime = new Date(transacoesSemConfirmacao[0].dataAbertura);
            let dataAbertura = new Date(dataTime.getTime() - 24 * 60 * 60 * 1000);
            let dataAberturaString = `${dataAbertura.toLocaleDateString()}T${dataAbertura.toLocaleTimeString()}`;
            const options = {
                method: 'GET',
                url: `https://${variables.pagseguroHost}/v2/transactions%0A`,
                qs:
                {
                    initialDate: `${dataAberturaString}`,
                    finalDate: `${dataFinalizacaoString}`,
                    page: '1',
                    maxPageResults: '100',
                    email: `${variables.emailPagseguro}`,
                    token: `${variables.tokenPagseguro}`
                },
                headers:
                    { 'content-type': 'application/x-www-form-urlencoded; charset=ISO-8859-1' }
            };
            let requestXml = await requestAsync(options);
            let data = JSON.parse(convert.xml2json(requestXml, { compact: true, spaces: 4 }));

            let transacoes = data.transactionSearchResult.transactions.transactionlength == 0 ? [data.transactionSearchResult.transactions.transaction] : data.transactionSearchResult.transactions.transaction;
            let transacoesRemover = [];
            let transacoesAtualizar = [];

            transacoesSemConfirmacao.map(transacao => {
                transacoes.find(x => {
                    if (transacao.idCompra == x.reference._text) {
                        transacoesAtualizar.push(x);
                    }
                });
                if (!(transacoes.find(x => transacao.idCompra == x.reference._text))) transacoesRemover.push(transacao);
            });

            transacoesRemover.map(async transacao => {
                await Pagseguro.deleteOne({ idCompra: transacao.idCompra });
            });

            transacoesAtualizar.map(async transacao => {
                let index = transacoesSemConfirmacao.findIndex(x => x.idCompra == transacao.reference._text);
                if (!transacoesSemConfirmacao[index].finalizado) {
                    transacoesSemConfirmacao[index].statusCode = transacao.status._text;
                    transacoesSemConfirmacao[index].verificado = true;

                    if (transacao.status._text == "3") {
                        transacoesSemConfirmacao[index].finalizado = true;
                        transacoesSemConfirmacao[index].dataFinalizacao = new Date();
                        const buscaTransacao = await Transacao.findOne({ hashCompra: transacoesSemConfirmacao[index].idCompra });
                        if (!buscaTransacao) {
                            let novaTransacao = new Transacao({
                                quantia_transferida: transacoesSemConfirmacao[index].cifras,
                                enviado_por: transacoesSemConfirmacao[index].idUsuario,
                                recebido_por: transacoesSemConfirmacao[index].idUsuario,
                                tipo: "transferencia", //Tipo pode ser 'saque', 'compra', 'transferencia', "premio"	
                                status: 3, //status definido num util chamado statusCode
                                hashCompra: transacoesSemConfirmacao[index].idCompra
                            });
                            await novaTransacao.save();
                            await Usuario.updateOne({ _id: transacoesSemConfirmacao[index].idUsuario }, { $inc: { quantidade_cifras: transacoesSemConfirmacao[index].cifras } });
                        } else {
                            await Transacao.updateOne({ hashCompra: transacoesSemConfirmacao[index].idCompra }, { $set: { status: 3 } });
                            await Usuario.updateOne({ _id: transacoesSemConfirmacao[index].idUsuario }, { $inc: { quantidade_cifras: transacoesSemConfirmacao[index].cifras } });
                        }
                    } else {
                        transacoesSemConfirmacao[index].statusCode = parseInt(transacao.status._text);
                        const buscaTransacao = await Transacao.findOne({ hashCompra: transacoesSemConfirmacao[index].idCompra });
                        if (!buscaTransacao) {
                            let novaTransacao = new Transacao({
                                quantia_transferida: transacoesSemConfirmacao[index].cifras,
                                enviado_por: transacoesSemConfirmacao[index].idUsuario,
                                recebido_por: transacoesSemConfirmacao[index].idUsuario,
                                tipo: "transferencia", //Tipo pode ser 'saque', 'compra', 'transferencia', "premio"	
                                status: parseInt(transacao.status._text), //status definido num util chamado statusCode
                                hashCompra: transacoesSemConfirmacao[index].idCompra
                            });
                            await novaTransacao.save();
                        } else {
                            await Transacao.updateOne({ hashCompra: transacoesSemConfirmacao[index].idCompra }, { $set: { status: parseInt(transacao.status._text) } });
                        }
                    }

                    await Pagseguro.update({ idCompra: transacoesSemConfirmacao[index].idCompra }, { $set: transacoesSemConfirmacao[index] });
                }
            });
        }

        if (transacoesConfirmadas.length > 0) {
            let dataTime = new Date(transacoesConfirmadas[0].dataAbertura);
            let dataAbertura = new Date(dataTime.getTime() - 24 * 60 * 60 * 1000);
            let dataAberturaString = `${dataAbertura.toLocaleDateString()}T${dataAbertura.toLocaleTimeString()}`;
            const options = {
                method: 'GET',
                url: `https://${variables.pagseguroHost}/v2/transactions%0A`,
                qs:
                {
                    initialDate: `${dataAberturaString}`,
                    finalDate: `${dataFinalizacaoString}`,
                    page: '1',
                    maxPageResults: '100',
                    email: `${variables.emailPagseguro}`,
                    token: `${variables.tokenPagseguro}`
                },
                headers:
                    { 'content-type': 'application/x-www-form-urlencoded; charset=ISO-8859-1' }
            };
            let requestXml = await requestAsync(options);
            let data = JSON.parse(convert.xml2json(requestXml, { compact: true, spaces: 4 }));

            let transacoes = data.transactionSearchResult.transactions.transactionlength == 0 ? [data.transactionSearchResult.transactions.transaction] : data.transactionSearchResult.transactions.transaction;

            transacoes.map(async transacao => {
                let index = transacoesConfirmadas.findIndex(x => x.idCompra == transacao.reference._text);
                if (index >= 0) {
                    if (transacoesConfirmadas[index].statusCode !== transacao.status._text) {
                        transacoesConfirmadas[index].verificado = true;

                        if (transacao.status._text == "3") {
                            transacoesConfirmadas[index].finalizado = true;
                            transacoesConfirmadas[index].dataFinalizacao = new Date();
                            transacoesConfirmadas[index].statusCode = 3;
                            const buscaTransacao = await Transacao.findOne({ hashCompra: transacoesConfirmadas[index].idCompra });

                            if (!buscaTransacao) {
                                let novaTransacao = new Transacao({
                                    quantia_transferida: parseFloat(transacoesConfirmadas[index].cifras),
                                    enviado_por: transacoesConfirmadas[index].idUsuario,
                                    recebido_por: transacoesConfirmadas[index].idUsuario,
                                    tipo: "transferencia", //Tipo pode ser 'saque', 'compra', 'transferencia', "premio"	
                                    status: 3, //status definido num util chamado statusCode
                                    hashCompra: transacoesConfirmadas[index].idCompra,
                                });
                                await novaTransacao.save();
                                await Usuario.updateOne({ _id: transacoesConfirmadas[index].idUsuario }, { $inc: { quantidade_cifras: transacoesConfirmadas[index].cifras } });
                            } else {
                                await Transacao.updateOne({ hashCompra: transacoesConfirmadas[index].idCompra }, { $set: { status: 3 } });
                                await Usuario.updateOne({ _id: transacoesConfirmadas[index].idUsuario }, { $inc: { quantidade_cifras: transacoesConfirmadas[index].cifras } });
                            }
                            // Processar a transferencia.
                        } else {
                            transacoesConfirmadas[index].statusCode = parseInt(transacao.status._text);
                            const buscaTransacao = await Transacao.findOne({ hashCompra: transacoesConfirmadas[index].idCompra });
                            if (!buscaTransacao) {
                                let novaTransacao = new Transacao({
                                    quantia_transferida: transacoesConfirmadas[index].cifras,
                                    enviado_por: transacoesConfirmadas[index].idUsuario,
                                    recebido_por: transacoesConfirmadas[index].idUsuario,
                                    tipo: "transferencia", //Tipo pode ser 'saque', 'compra', 'transferencia', "premio"	
                                    status: parseInt(transacao.status._text), //status definido num util chamado statusCode
                                    hashCompra: transacoesConfirmadas[index].idCompra
                                });
                                await novaTransacao.save();
                            } else {
                                await Transacao.updateOne({ hashCompra: transacoesConfirmadas[index].idCompra }, { $set: { status: parseInt(transacao.status._text) } });
                            }
                        }

                        await Pagseguro.update({ idCompra: transacoesConfirmadas[index].idCompra }, { $set: transacoesConfirmadas[index] });
                    }
                }

            });
        }
    });
}