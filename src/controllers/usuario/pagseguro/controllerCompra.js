const variables = require('../../../../config/variables');
const request = require("request");
const convert = require('xml-js');
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
            reference: 'compraDescifre'
        }
    };

    request(options, function (error, response, body) {
        if (error) res.status(httpCodes.getValue('ServerErro')).json({status: false, msg: "Erro de processamento interno."})
        
        let data = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
        let checkout={
            code:data.checkout.code._text
        }
        res.status(httpCodes.getValue('OK')).json({status:true, checkout: checkout});
    });
}