exports.errosCadastro = (req) => {
    /* Verificando se todos os campos estão preenchidos */
    req.assert('idUsuario', 'Você deve informar um id de usuário').notEmpty();
    req.assert('senha', 'Você deve informar uma senha de usuário').notEmpty();
    req.assert('tipo', 'Você deve informar um tipo de usuário').notEmpty();
    req.assert('quantiaTransferida', 'Você deve informar uma quantidade de cifras.').notEmpty();
    req.assert('quantiaTransferida', 'Você deve informar o valor de 150 cifras pelo menos').isFloat({ gt: 149 });
    const erros = req.validationErrors();
    return erros;
};