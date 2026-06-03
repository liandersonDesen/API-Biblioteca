const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',    
        info: {
            title: 'API Biblioteca',            
            version: '1.0.0',
            description: 'API para gerenciamento de acervo e empréstimos',
        },
        servers: [
            {
                url: `http://localhost:3000`,
                description: "Servidor local",
            },
        ],        
    },
    apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);