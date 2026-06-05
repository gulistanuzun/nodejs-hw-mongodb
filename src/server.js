import express from 'express';
import cors from 'cors';
import pinohttp from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export function setupServer() {
  const app = express();
  app.use(cors());
  app.use(pinohttp());
  app.use('/contacts', contactsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
