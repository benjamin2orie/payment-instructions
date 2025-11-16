
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
// import paymentInstructionsRoutes from './routes/paymentInstructions.js';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpecs } from './config/swagger.js';
// import swaggerJsdoc from 'swagger-jsdoc';
import http from 'http';
import router from './routes/intruction_route.js';
import { connectDB } from './config/db_config.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
app.use(cors({
    origin: ['*'],
    methods: ['GET', 'POST',]

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/health', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Test successful' });
});


app.use('/', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
}); 
await connectDB();
export default app;


