import 'dotenv/config';
import express from 'express';
import routes from '../routes/index.js';
import errorHandler from '../middlewares/error.js';

const app = express();

app.use('/album-covers', express.static('uploads/album-covers'));
app.use(express.json());
app.use('/', routes);
app.use(errorHandler);

export default app;