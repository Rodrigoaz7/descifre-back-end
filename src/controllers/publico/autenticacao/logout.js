const httpCodes = require('../../../util/httpCodes');
const returns = require('../../../util/returns');
const validators = require('../../../index');
const utilToken = require('../../../util/token');
const responses = require('../../../util/responses');

exports.realizarLogout = async (req, res) => {
    const erros = validators.publico.autenticacao.logout.errosLogout(req);
    
    const apagarSessao = await utilToken.destruirToken(utilToken.getTokenRequest(req));
    
    if (erros) return res.status(httpCodes.get('NaoAutorizado')).json({status: false, erros: erros});

    if(apagarSessao) return res.status(httpCodes.get('OK')).json({status: true, msg: "Sessão finalizada com sucesso."});

    return res.status(httpCodes.get('ServerErro')).json({status: false, msg: responses.getValue('erroToken')});
};