const mongoose = require('mongoose');
const variables = require('../../../../config/variables');
const Pagseguro = mongoose.model('Pagseguro');
const request = require("request");
const convert = require('xml-js');
const httpCodes = require('../../../util/httpCodes');
const randomstring = require("randomstring");
exports.realizarCheckout = async (req, res) => {
    const urlPagseguro = `?email=&token=`;
    let valor = (parseFloat(req.body.preco)).toFixed(2);
    valor = (valor/parseInt(req.body.quantidadeCifras)).toFixed(2);
    let hash = randomstring.generate(10);
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
            reference: hash
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let objetoPagseguro = {
            idUsuario: req.body.idUsuario,
            cifras: parseInt(req.body.quantidadeCifras),
            valorPago: (parseFloat(valor)*parseFloat(req.body.quantidadeCifras)).toFixed(2),
            statusCode: 0,
            idCompra:hash,
            verificado: false
        }
        let mongoosePagseguro = new Pagseguro(objetoPagseguro);
        mongoosePagseguro.save((err, dataMongoose)=>{
            let data = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
            if(err) return res.status(500).json({status: false, erros:[{msg:"Erro interno."}]});
            let checkout={
                code:data.checkout.code._text
            }
            res.status(httpCodes.getValue('OK')).json({status:true, checkout: checkout});
        });
    });
}