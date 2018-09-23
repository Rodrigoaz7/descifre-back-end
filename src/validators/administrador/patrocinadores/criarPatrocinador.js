exports.errosCadastro = (req) => {
    /* Verificando se todos os campos estão preenchidos */
    req.assert('nome', 'A empresa deve possuir um nome').notEmpty();
    req.assert('tipo_patrocinador', 'Você deve informar o tipo do patrocinador').notEmpty();
    req.assert('quantia_paga', 'A quantia paga deve ser informada').notEmpty();

    const erros = req.validationErrors();
    return erros;
};