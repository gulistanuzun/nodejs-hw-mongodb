import express from 'express';
import cors from 'cors';
import pinohttp from 'pino-http';
import contactsRouter from './routers/contacts.js';

export function setupServer() {
  const app = express();
  app.use(cors());
  app.use(pinohttp());
  app.use('/contacts', contactsRouter);
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });
  return app;
}
