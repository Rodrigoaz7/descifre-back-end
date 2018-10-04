const variables = require('../../../../config/variables');
const request = require("request");
const parser = require('xml2json');
const httpCodes = require('../../../util/httpCodes');

exports.buscarTransacao = async (req, res) => {
    const options = {
        method: 'GET',
        url: `https://${variables.pagseguroHost}/v2/checkout`,
        qs:
        {
            email: `${variables.emailPagseguro}`,
            token: `${variables.tokenPagseguro}`,
            reference: req.body.idUsuario
        },
        headers:
        {
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded; charset=ISO-8859-1'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });

}