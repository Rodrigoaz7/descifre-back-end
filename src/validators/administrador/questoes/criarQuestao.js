exports.errosCadastro = (req) => {
    /* Verificando se todos os campos estão preenchidos */
    req.assert('usuario', 'Um usuário deve cadastar a questao').notEmpty();
    req.assert('enunciado', 'O enunciado não pode ser vazio').notEmpty();
    req.assert('alternativas', 'A questão deve possuir alternativas não pode ser vazio').notEmpty();
    req.assert('categoria', 'A questão deve ter uma categoria').notEmpty();
    req.assert('correta', 'Você deve estabelecer uma alternativa como correta').notEmpty();
    req.assert('pontuacao', 'A pontuação deve ser preenchida').notEmpty();
    req.assert('dataCriacao', 'A data de criação da questão é obrigatória').notEmpty();

    const erros = req.validationErrors();
    return erros;
};