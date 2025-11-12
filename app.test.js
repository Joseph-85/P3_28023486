
const request = require('supertest');
const app = require('./app'); // usar la app principal
const { sequelize } = require('./models/database');

jest.setTimeout(30000);

beforeAll(async () => {
    // Forzar recreación de la BD para tests aislados
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Auth API', () => {
    let token;
    let createdUserId;
    const testPassword = 'micuenta1234';
    const testEmail = `test.user.${Date.now()}@example.com`;

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ fullName: 'Pepe Martines', email: testEmail, password: testPassword });

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('fullName');
        expect(response.body.data).toHaveProperty('email');
        createdUserId = response.body.data.id;
    });

    it('should login the user and return a token', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: testEmail, password: testPassword });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body).toHaveProperty('token');
        token = response.body.token;
    });

    it('should get all users', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get a user by id', async () => {
        const response = await request(app)
            .get(`/api/users/${createdUserId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.id).toBe(createdUserId);
    });

    it('should create a new user (protected)', async () => {
        const newEmail = `jane.${Date.now()}@example.com`;
        const response = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ fullName: 'Jane Doe', email: newEmail, password: 'pass123' });

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('id');
    });

    it('should update a user by id', async () => {
        const response = await request(app)
            .put(`/api/users/${createdUserId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ fullName: 'Pepe Martinez Torres', email: `updated.${Date.now()}@example.com` });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('fullName');
        expect(response.body.data).toHaveProperty('email');
    });

    it('should delete a user by id', async () => {
        const response = await request(app)
            .delete(`/api/users/${createdUserId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
    });
});