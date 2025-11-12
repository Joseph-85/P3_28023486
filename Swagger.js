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
        /*servers: [
            {
                url: 'http://localhost:3000', // Cambia esto si tu servidor corre en otro puerto
            },
        ],*/
    },
    apis: ['./routes/userRoutes.js'], // Ruta a los archivos donde están los comentarios JSDoc
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) =>{
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
