var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentación de la API utilizando Swagger',
        },
    },
    apis: ['./app.js'], // Ruta a los archivos donde están los comentarios JSDoc
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



app.use(logger('dev'));
app.use(express.json());

// Endpoint 1: /ping
/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Responde con un mensaje de "pong"
 *     responses:
 *       200:
 *         description: Respuesta exitosa con "pong"
 */
app.get('/ping', (req, res) => {
    res.status(200).send('pong'); // Responde con código de estado 200 y cuerpo vacío
});

// Endpoint 2: /about
/**
 * @swagger
 * /about:
 *   get:
 *     summary: Devuelve información sobre la API
 *     responses:
 *       200:
 *         description: Información sobre la API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       example: Joseph Ortega
 *                     cedula:
 *                       type: number
 *                       example: 28023486
 *                     seccion:
 *                       type: number
 *                       example: 1
 */
app.get('/about', (req, res) => {
    const response = {
        status: 'success',
        data: {
            nombre: '',  // Aqui va tu nombre
            cedula: '',  // Aqui va tu cédula
            seccion: '',  // Aqui va tu sección
        }
    };
    res.status(200).json(response);
});


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
