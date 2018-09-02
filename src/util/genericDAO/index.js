const eventEmitter = new (require('events').EventEmitter)();

exports.salvar = async (obj, cb) => {
    let objSave;
    let codeError;
    
    try{
        objSave = await obj.save();
    }catch(error){
        objSave = {
            error: true,
            code: error.code,
            msgDev: error.errmsg
        };
    }
    return objSave;
};