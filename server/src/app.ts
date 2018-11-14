import express, { Response, Request, NextFunction, ErrorRequestHandler} from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';

import routes from './routes/notification';

dotenv.config({ path: '.env' });
const { PORT, NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

// Handle 404s
app.use((req: Request, res: Response) => {
  const err = new Error('Page Not Found.');
  return res.status(404).json({ error: err });
});

// Handle server errors
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) { return next(err); }
  return res.status(500).json({ error: isDev ? err : null });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} in ${NODE_ENV} mode`);
});