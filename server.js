const app = require('./config/app');
const gerarGanhadoresRodada = require('./scripts/gerarGanhadoresRodada');
const atualizarStatusPagseguro = require('./scripts/atualizarStatusCompras');
const criarRodadas = require('./scripts/criarRodadasDoDia');
app.listen(process.env.PORT, async () => {
    await gerarGanhadoresRodada.agendarGanhadores();
    await atualizarStatusPagseguro.realizarAtualizacao();
    await criarRodadas.criarRodada();
    console.log(`➡➡➡ The server is online: http://localhost:${process.env.PORT}/ ☻`);
});
