
const express = require('express');
const { login } = require('./controllers/autenticacion');
const { verificarToken } = require('./middleware');
const app = express();

app.use(express.json());

const { obtenerJugadores, registrarJugador } = require('./controllers/jugadores');
const { obtenerEquipos, agregarEquipo } = require('./controllers/equipos');

app.get('/equipos', obtenerEquipos);
// app.post('/equipos', agregarEquipo);
app.post('/equipos', verificarToken, agregarEquipo);
app.post('/login', login);



app.get('/equipos/:teamID/jugadores', obtenerJugadores);
// app.post('/equipos/:teamID/jugadores', registrarJugador);
app.post('/equipos/:teamID/jugadores', verificarToken, registrarJugador);

if (require.main === module) {
    app.listen(3000, () => console.log('SERVER ON'));
}

module.exports = app;
