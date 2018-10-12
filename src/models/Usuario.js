/*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    pessoa: {
        type: Schema.Types.ObjectId,
        ref: 'Pessoa'
    },
    email: String,
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
    dataEdicao: [Date],
    quantidade_cifras: {
        type: Number,
        default: 0
    },
    ganhadoresRodada: {
        type: Boolean,
        default: false
    }
});
// Paginacao
UsuarioSchema.plugin(mongoosePaginate);
mongoose.model('Usuario', UsuarioSchema);