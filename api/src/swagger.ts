import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Locadora de Veículos',
      version: '1.0.0',
      description: 'API para gerenciar uma locadora de veículos',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
    components: {
      // ⚡ Aqui definimos o esquema de segurança Bearer JWT
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // só uma referência visual
        },
      },
    },
    // 🔒 Aplica segurança globalmente em todas as rotas por padrão
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // caminhos onde o Swagger vai buscar os comentários JSDoc
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
};
