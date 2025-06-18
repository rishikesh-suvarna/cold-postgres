import 'dotenv/config';

import logger from './utils/logger.js';
import { PG_DATABASE, S3_BUCKET_NAME } from './config/env.config.js';

import './lib/scheduler.js';

logger.info(`Backup service started for the Database: ${PG_DATABASE} to be stored in S3 Bucket: ${S3_BUCKET_NAME}`);
