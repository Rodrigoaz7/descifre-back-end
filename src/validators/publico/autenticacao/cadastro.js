exports.errosCadastro = (req) => {
    req.body.termos = Boolean(req.body.termos);
    
    /* Verificando se todos os campos estão preenchidos */
    req.assert('nome', 'O seu nome não pode ser vazio').notEmpty();
    req.assert('email', 'O e-mail não pode ser vazio').notEmpty();
    req.assert('senha', 'A sua senha não pode ser vazia').notEmpty();
    req.assert('repetirSenha', 'Você deve repetir sua senha').notEmpty();

    /* Outras verificações */
    req.assert('senha', 'As senhas não são iguais').equals(req.body.repetirSenha);
    req.assert('senha', 'A sua senha deve ter pelo menos 5 caracteres').isLength({ min: 5 });
    req.assert('termos', 'Você deve aceitar os termos').isBoolean(false);

    const erros = req.validationErrors();
    return erros;
};