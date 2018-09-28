const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

exports.saveFile = async (file,urlArquivo,cb) => {
    if(file==="") return false;
    await file.mv(urlArquivo, err => {
        if (err) cb(status=false,erro=true);
        else cb(status=true,erro=false);
    }); 
};

exports.createDir = async (url, cb) => {
    mkdirp(url, err => {
        if (err) cb(status=false, err=true);
        else cb(status=true, err=false);
    });  
};

exports.getExt = async (file) => {
    return path.extname(file.name);
};

