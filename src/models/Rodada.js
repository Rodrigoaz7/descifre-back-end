    /*
    Autor: Marcus Dantas
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RodadaSchema = new Schema({
    titulo: String,
    dataAbertura: Date,
    dataFinalizacao: Date,
    duracao: Number,
    premiacao: Number,
    premioVoucher:String,
    emailPatrocinador: String,
    jogadores:[{
        quiz:{
            type: Schema.Types.ObjectId,
            ref: 'Quiz'
        }
    }],
    ganhadores:[{
        jogador:{
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
        },
        porcentagemPremio: Number,
        voucher:{
            type: Schema.Types.ObjectId,
            ref: 'Voucher'
        } 
    }],
    abertoPor:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'  
    },
    taxa_entrada: Number,
    pagamentoEmCifras:{
        type: Boolean,
        default: true
    }
});

mongoose.model('Rodada', RodadaSchema);