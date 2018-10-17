/*
*   Autor Marcus Dantas
*/
exports.errosCadastro = (req) => {

    req.assert('titulo', 'O titulo não pode ser vazio').notEmpty();
    req.assert('dataAbertura', 'A data de abertura não pode ser vazia').notEmpty();
    req.assert('dataFinalizacao', 'A data de finalização não pode ser vazia').notEmpty();
    req.assert('duracao', 'A duração não pode ser vazia').notEmpty();
    req.assert('premiacao', 'A premiação não pode ser vazia').notEmpty();
    req.assert('ganhadores', 'Os ganhadores não podem ser vazios').notEmpty();
    
    let erros = req.validationErrors();
    req.body.dataFinalizacao = new Date(req.body.dataFinalizacao);
    req.body.dataAbertura = new Date(req.body.dataAbertura);

    if(req.body.dataFinalizacao.getTime() - req.body.dataAbertura.getTime() <= 0){
        let erro_data = [];
        erro_data.push({msg: "A data de finalização tem que sair maior que a data de abertura."});
        return erro_data;
    }
    return erros;
};