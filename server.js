const app = require('./config/app');
const gerarGanhadoresRodada = require('./scripts/gerarGanhadoresRodada');
//const atualizarTransacoes = require('./scripts/atualizarStatusTransacoes');
app.listen(process.env.PORT, async () => {
    await gerarGanhadoresRodada.agendarGanhadores();
    // await atualizarTransacoes.ouvirAtualizacoes();
    console.log(`➡➡➡ The server is online: http://localhost:${process.env.PORT}/ ☻`);
});
