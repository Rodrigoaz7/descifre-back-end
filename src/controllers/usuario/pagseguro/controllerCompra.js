const variables = require('../../../../config/variables');
const request = require("request");
const parser = require('xml2json');
const httpCodes = require('../../../util/httpCodes');
exports.realizarCheckout = async (req, res) => {
    const urlPagseguro = `?email=&token=`;
    let valor = (parseFloat(req.body.preco)).toFixed(2);
    valor = (valor/parseInt(req.body.quantidadeCifras)).toFixed(2);
    var options = {
        method: 'POST',
        url: `https://${variables.pagseguroHost}/v2/checkout`,
        qs:
        {
            email: `${variables.emailPagseguro}`,
            token: `${variables.tokenPagseguro}`
        },
        headers:
        {
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded'
        },
        form:
        {
            currency: 'BRL',
            itemId1: '0001',
            itemDescription1: 'Cifras - Web moeda do jogo De$cifre',
            itemAmount1: `${valor}`,
            itemQuantity1: `${parseInt(req.body.quantidadeCifras)}`,
            acceptPaymentMethodGroup: 'CREDIT_CARD,BOLETO',
            acceptPaymentMethodName: 'DEBITO_BANCO_BRASIL,DEBITO_BRADESCO',
            reference: req.body.idUsuario
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        
        const jsonResponse = parser.toJson(body);
        let data = JSON.parse(jsonResponse);

        res.status(httpCodes.getValue('OK')).json({status:true, checkout: data.checkout});
    });
}