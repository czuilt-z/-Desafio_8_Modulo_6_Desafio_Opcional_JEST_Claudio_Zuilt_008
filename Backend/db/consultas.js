require('dotenv').config();

// const { Pool } = require('pg');

// const pool = new Pool({
//     host: 'localhost',
//     user: 'postgres',
//     password: 'contraseña',
//     database: 'futscript',
//     allowExitOnIdle: true
// });

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT),
    allowExitOnIdle: true
});



// Obtener todos los equipos
const getTeams = async () => {
    const { rows } = await pool.query(
        'SELECT id, name FROM equipos ORDER BY id'
    );
    return rows;
};

// Obtener los jugadores de un equipo y sus posiciones
const getPlayers = async (teamID) => {
    const query = `
        SELECT jugadores.name, posiciones.name AS posicion
        FROM jugadores
        INNER JOIN posiciones
            ON jugadores.position = posiciones.id
        WHERE jugadores.id_equipo = $1
        ORDER BY jugadores.id
    `;

    const { rows } = await pool.query(query, [teamID]);
    return rows;
};

// Registrar un equipo
const addTeam = async (equipo) => {
    const query = `
        INSERT INTO equipos (name)
        VALUES ($1)
        RETURNING *
    `;

    const { rows } = await pool.query(query, [equipo.name]);
    return rows[0];
};

// Registrar un jugador
const addPlayer = async ({ jugador, teamID }) => {
    const query = `
        INSERT INTO jugadores (name, id_equipo, position)
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    const values = [
        jugador.name,
        teamID,
        jugador.position
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
};

const cerrarPool = async () => {
    await pool.end();
};

module.exports = {
    getTeams,
    addTeam,
    getPlayers,
    addPlayer,
    cerrarPool
};