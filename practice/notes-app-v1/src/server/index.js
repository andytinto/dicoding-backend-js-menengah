import 'dotenv/config';
import express from 'express';
import routes from '../routes/index.js';
import errorHandler from '../middlewares/error.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/', routes);
app.use(errorHandler);



export default app;
