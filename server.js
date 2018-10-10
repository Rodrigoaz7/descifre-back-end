const app = require('./config/app');
const gerarGanhadoresRodada = require('./scripts/gerarGanhadoresRodada');
const atualizarStatusPagseguro = require('./scripts/atualizarStatusCompras');
app.listen(process.env.PORT, async () => {
    await gerarGanhadoresRodada.agendarGanhadores();
    await atualizarStatusPagseguro.realizarAtualizacao();
    console.log(`➡➡➡ The server is online: http://localhost:${process.env.PORT}/ ☻`);
});
