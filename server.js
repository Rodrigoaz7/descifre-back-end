const app = require('./config/app');
const gerarGanhadoresRodada = require('./scripts/gerarGanhadoresRodada');
app.listen(process.env.PORT, async () => {
    await gerarGanhadoresRodada.agendarGanhadores();
    console.log(`➡➡➡ The server is online: http://localhost:${process.env.PORT}/ ☻`);
});
