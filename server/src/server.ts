import dotenv from 'dotenv';

import app from './app';
import logger from './utils/logger';

dotenv.config({ path: '.env' });
const { PORT, NODE_ENV } = process.env;

// Start Express
app.listen(PORT, () => {
  logger.info(`App listening on port ${PORT} in ${NODE_ENV} mode`);
});