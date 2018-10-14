const request = require("request");
const token = require('../../../config/variables').tokenEmail;
const url = require('../../../config/variables').urlPostEmail;
exports.enviarEmail = (arrayEmails, assunto, html) => {
    const options = { method: 'POST',
    url: `${url}/email/enviar-html`,
    headers: 
    {   'cache-control': 'no-cache',
        'content-type': 'application/json' },
    body: 
    {   listaEmails: arrayEmails,
        assunto: assunto,
        html: html,
        token: token },
    json: true };
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) reject(error);
            resolve(body);
        });
    });
}