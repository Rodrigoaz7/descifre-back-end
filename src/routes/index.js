const permissao = require('../middlewares/permissoes');
module.exports = (application) => {
    application.get('/', permissao.administrador, (req, res) => { res.send('Welcome to your application node :)') });
};
