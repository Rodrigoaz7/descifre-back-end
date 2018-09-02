exports.errosLogin = (req) => {
    
    /* Verificando se todos os campos estão preenchidos */
    req.assert('email', 'O e-mail não pode ser vazio').notEmpty();
    req.assert('senha', 'A sua senha não pode ser vazia').notEmpty();
    req.assert('senha', 'A sua senha deve ter pelo menos 5 caracteres').isLength({ min: 5 });

    const erros = req.validationErrors();
    return erros;
};