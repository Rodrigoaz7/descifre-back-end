const Enum = require('enum');

const responses = new Enum({
    'erroCriarUsuario': "Problema ao criar usuario.",
    'problemaInterno': "O sistema apresentou um erro de processamento interno.",
    "usuarioCriado": "Usuário criado com sucesso.",
    "usuarioInvalido": "Usuário ou senha inválidos.",
    'erroToken': "Problema ao sair da sessão",
    "questaoCriado": "Questão criado com sucesso",
    "questaoDeletada": "Questão deletada com sucesso",
    "questaoAtualizada": "Questão atualizada com sucesso",
    "dadosListados": "Dados listados com sucesso"
});
module.exports = responses;