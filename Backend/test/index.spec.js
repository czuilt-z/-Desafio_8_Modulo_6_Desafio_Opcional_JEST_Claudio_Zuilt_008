
const request = require('supertest');
const app = require('../index');
const { cerrarPool } = require('../db/consultas');

describe('GET /equipos', () => {
    it('debería devolver un arreglo de equipos y estado 200', async () => {
        const response = await request(app).get('/equipos');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});


describe('POST /login', () => {
    it('debería devolver un token con credenciales correctas', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                username: 'admin',
                password: '1234'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                token: expect.any(String)
            })
        );
    });

    it('debería devolver 400 con credenciales incorrectas', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                username: 'admin',
                password: 'incorrecta'
            });

        expect(response.statusCode).toBe(400);
    });
});


describe('Autenticación de rutas protegidas', () => {
    it('debería rechazar la creación de un equipo sin token', async () => {
        const response = await request(app)
            .post('/equipos')
            .send({ name: 'Barcelona Test' });

        expect(response.statusCode).toBe(401);
    });

    it('debería permitir crear un equipo con un token válido', async () => {
        const loginResponse = await request(app)
            .post('/login')
            .send({
                username: 'admin',
                password: '1234'
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .post('/equipos')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Barcelona Test' });

        expect(response.statusCode).toBe(200);
    });
});


describe('POST /equipos/:teamID/jugadores', () => {
    it('debería rechazar el registro sin token', async () => {
        const response = await request(app)
            .post('/equipos/1/jugadores')
            .send({
                name: 'Jugador de prueba',
                position: 1
            });

        expect(response.statusCode).toBe(401);
    });

    it('debería registrar un jugador con token válido y devolver 201', async () => {
        const loginResponse = await request(app)
            .post('/login')
            .send({
                username: 'admin',
                password: '1234'
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .post('/equipos/1/jugadores')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Jugador de prueba',
                position: 1
            });

        expect(response.statusCode).toBe(201);
    });
});

afterAll(async () => {
    await cerrarPool();
});
