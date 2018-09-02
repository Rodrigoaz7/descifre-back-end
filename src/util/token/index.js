const mongoose = require('mongoose');
const Token = mongoose.model('Token');

const jwt = require('jsonwebtoken');

const secret = require('../../../config/variables').secret;
const genericDAO = require('../genericDAO');

exports.getTokenRequest = (req) => {
    return req.body.token || req.query.token || req.headers['x-access-token'] || req.params.token;
};

exports.salvarToken = async (token) => {
    if(!token) return {msg: "Você deve passar um token."};
    const _token = new Token({
        token: token
    });
    const salvarToken = await genericDAO.salvar(_token);
    if(salvarToken.error) return salvarToken;
    return salvarToken;
}

exports.destruirToken = async (token) => {
    if(!token) return {msg: "Você deve passar um token."};
    const _token = await Token.deleteOne({token:token});
    if(_token.n!==0) return true;
    else return false;
};

const decoded = exports.decoded = (token)=>{
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded)=>{
            if(err) reject(err);
            else resolve(decoded);
        });
    });
}

exports.verificarToken = async (token) => {
    if(!token) return {msg: "Você deve passar um token."};
    const _token = await Token.findOne({token:token});
    if(!token) return {renovarToken: false, tokenValido: false};
    const dataToken = decoded(_token);
    const time = new Date().getTime();
    if(time>dataToken.exp) return {renovarToken:true, tokenValido: false};
    return {renovarToken:false, tokenValido: true};
};

exports.gerarToken = (informations=true,timeExpiresHours=24) => {
    timeExpiresHours = `${timeExpiresHours}h`;
    let token = jwt.sign(informations, secret, {expiresIn: timeExpiresHours});
    return token;
};