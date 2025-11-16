import dotenv from 'dotenv';
dotenv.config();
import swaggerJsdoc from 'swagger-jsdoc';

const PORT = process.env.PORT || 4000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Payment Instructions API',
      version: '1.0.0',
      description: 'API for managing payment instructions',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
      {
        url:`https://payment-instructions.onrender.com`
      },
    ],
  },
  apis: ['./src/routes/*.js'], 
};

export const swaggerSpecs = swaggerJsdoc(swaggerOptions);
