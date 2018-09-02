/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    idPessoa: {
        type: Schema.Types.ObjectId,
        ref: 'pessoas'
    },
    permissoes: [String],
    senha: String,
    recuperarSenha: {
        token: String,
        ativo: {
            type: Boolean,
            default: false
        }
    },
    dataCriacao: {
        type: Date,
        default: new Date()
    },
    dataEdicao: [Date]
});

mongoose.model('Usuario', UsuarioSchema);