const variables = require('../config/variables');
const request = require("request");
const parser = require('xml2json');
const schedule = require('node-schedule');

exports.ouvirAtualizacoes = async (req, res) => {
    const options = {
        method: 'GET',
        url: `https://${variables.pagseguroHost}/v2/transactions`,
        qs:
        {
            email: `${variables.emailPagseguro}`,
            token: `${variables.tokenPagseguro}`,
            reference: 'compraDescifre'
        },
        headers:
        {
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded; charset=ISO-8859-1'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const jsonResponse = parser.toJson(body);
        let data = JSON.parse(jsonResponse);
        let transacoes = data.transactionSearchResult.transactions.transaction;
        let transacoesPagas = [];
        transacoes.map(transacao=>{
            if(transacao.status=='1') transacoesPagas.push(transacao);
        });
        
        console.log(transacoesPagas)
    });
    // schedule.scheduleJob('30 * * * * *', function(){
    //     console.log('The answer to life, the universe, and everything!');
    // });

}