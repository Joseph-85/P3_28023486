const request = require('supertest');
const express = require('express');

// Importar la aplicación desde tu archivo app.js
const app = require('./app'); // Asegúrate de exportar la app desde app.js

describe('API Endpoints', () => {
    it('GET /ping should respond with status 200', async () => {
        const response = await request(app).get('/ping');
        expect(response.status).toBe(200);
    });

    it('GET /about should respond with status 200 and correct structure', async () => {
        const response = await request(app).get('/about');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('nombre');
        expect(response.body.data).toHaveProperty('cedula');
        expect(response.body.data).toHaveProperty('seccion');
    });
});