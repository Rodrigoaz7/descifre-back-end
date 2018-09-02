exports.errosLogout = (req) => {
    
    req.assert('token', 'Você deve passar um token').notEmpty();
    
    const erros = req.validationErrors();
    return erros;
};