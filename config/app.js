/* importar o módulo do framework express */
const express = require('express');

/* importar o módulo do consign */
const consign = require('consign');

/* importar o módulo do body-parser */
const bodyParser = require('body-parser');

/* Importar o módulo do express-fileupload. */
const fileUpload = require('express-fileupload');

/* importar o módulo do express-validator */
const expressValidator = require('express-validator');

/*Importando modulo morgan*/
const morgan = require('morgan');

/* iniciar o objeto do express */
const app = express();

/* Variaveis de ambiente. */
const env = require('dotenv');

/* Importando o módulo do mongoose. */
const mongoose = require('mongoose');

/* Importando o CORS */
const cors = require('cors')

/* configurar o middleware express.static */
app.use(express.static('./public'));

/*Configurando o fileUpload*/
app.use(fileUpload({
    limits: { fileSize: 15 * 1024 * 1024 },
    safeFileNames: true, preserveExtension: true
}));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/* configurar o middleware express-validator */
app.use(expressValidator());

/* Setando morgan */
app.use(morgan('dev'));

/* Extraindo variaveis de ambiente. */
env.config({ path: './env/dev.env' });

/* Conecta com o banco de dados e lida com problemas de conexão */
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise; // → Queremos que o mongoose utilize promises ES6
mongoose.connection.on('error',err => {
	console.log(`🙅 🚫 → ${err.message}`);
});

//app.use(cors());
app.use(function(req, res, next) {
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://descifre.com:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
});
/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign().include('src/models')
	.then('src/routes')
	.then('src/controllers').into(app);
	
/* exportar o objeto app */
module.exports = app;
