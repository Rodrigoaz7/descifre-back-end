const eventEmitter = new (require('events').EventEmitter)();

exports.salvar = async (obj) => {
    let objSave;
    let codeError;
    
    try{
        objSave = await obj.save();
    }catch(error){
        objSave = {
            error: true,
            code: error.code,
            msgDev: error.errmsg,
            mensagem: error.message
        };
    }
    return objSave;
};

exports.deletarUmObjeto = async (obj, data) => {
    let objSave;
    let codeError;
    
    try{
        objSave = await obj.deleteOne({...data});
    }catch(error){
        objSave = {
            error: true,
            code: error.code,
            msgDev: error.errmsg,
            mensagem: error.message
        };
    }
    
    return objSave;
};

exports.atualizarUmObjeto = async (obj, data_search, data_set) => {
    let objSave;
    let codeError;
    
    try{
        objSave = await obj.update({...data_search}, {...data_set}, {upsert: true});
    }catch(error){

        objSave = {
            error: true,
            code: error.code,
            msgDev: error.errmsg,
            mensagem: error.message
        };
    }
    
    return objSave;
};

exports.findOne = async (obj, populate, math) =>{
    let buscaUsuario = [];
    try{
        buscaUsuario = await obj.find().populate({ path: populate, match: math}).exec();
        let user = buscaUsuario.filter((usuario, index, array)=>{
            if(usuario.pessoa!==null) return usuario;
        });
        return user[0];
    }catch(err){
        return {
            error: true,
            code: error.code,
            msgDev: error.errmsg,
            mensagem: error.message
        };
    }    
}