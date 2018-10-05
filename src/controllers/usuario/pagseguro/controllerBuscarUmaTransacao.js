const request = require("request");
const variables = require('../../../../config/variables');
const parser = require('xml2json');
const httpCodes = require('../../../util/httpCodes');
exports.buscarTransacao = async (req, res) =>{
    
    const options = { method: 'GET',
    url: `https://${variables.pagseguroHost}/v2/transactions/${req.params.codigoTransacao}`,
    qs: 
    {   
        email: `${variables.emailPagseguro}`,
        token: `${variables.tokenPagseguro}`
    },
    headers: 
    { 
        'postman-token': '4666bc5b-8190-3bd7-444b-25f5567d37ec',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded; charset=ISO-8859-1' }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const jsonResponse = parser.toJson(body);
        let data = JSON.parse(jsonResponse);

        res.status(httpCodes.getValue('OK')).json({status:true, transacao: data.transaction});
        
    });

}