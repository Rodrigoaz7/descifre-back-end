
exports.salvar = async (obj) => {
    let objSave;
    try{
        objSave = await obj.save();
    }catch{
        objSave = null;
    }
    return objSave;
}