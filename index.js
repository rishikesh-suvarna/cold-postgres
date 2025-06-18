import 'dotenv/config';
import cron from 'node-cron';
import { exec } from 'child_process';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream, unlink } from 'fs';
import { promisify } from 'util';
import moment from 'moment';
import { cronToText } from './utils/cronsToText.js';

import logger from './utils/logger.js';
import {
  PG_HOST,
  PG_PORT,
  PG_USER,
  PG_PASSWORD,
  PG_DATABASE,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  S3_BUCKET_NAME,
  S3_PREFIX,
  CRON_SCHEDULES,
} from './config/index.js';

const execAsync = promisify(exec);

if (!CRON_SCHEDULES || !S3_BUCKET_NAME) {
  logger.error(
    'CRON_SCHEDULES and S3_BUCKET_NAME environment variables must be set.'
  );
  process.exit(1);
}

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

async function createPostgresDump() {
  const FORMATTED_TIMESTAMP = moment().format('YYYYMMDD_HHmmss');
  const DUMP_FILE = `/tmp/db_backup_${FORMATTED_TIMESTAMP}.sql`;
  const KEY = `${S3_PREFIX}/db_backup_${FORMATTED_TIMESTAMP}.sql`;

  const cmd = `PGPASSWORD="${PG_PASSWORD}" pg_dump -h ${PG_HOST} -p ${PG_PORT} -U ${PG_USER} -d ${PG_DATABASE} -F p -f ${DUMP_FILE}`;
  logger.info(`Executing command: ${cmd}`);

  try {
    await execAsync(cmd);

    const fileStream = createReadStream(DUMP_FILE);

    const uploadCommand = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: KEY,
      Body: fileStream,
      StorageClass: 'GLACIER',
    });

    await s3.send(uploadCommand);
    logger.info(
      `Backup successful: ${KEY} uploaded to S3 bucket ${S3_BUCKET_NAME}`
    );
  } catch (error) {
    logger.error(`Backup failed: ${error.message}`);
  } finally {
    // * Clean up local file
    try {
      unlink(DUMP_FILE, () => {});
      logger.info(`Local dump file deleted: ${DUMP_FILE}`);
    } catch (error) {
      logger.error(`Failed to delete local dump file: ${error.message}`);
    }
  }
}

const schedules = CRON_SCHEDULES;
schedules.forEach((cronExp) => {
  if (!cron.validate(cronExp)) {
    logger.warn(`Invalid cron expression: ${cronExp}`);
    return;
  }
  cron.schedule(cronExp, () => {
    logger.info(`Running backup task for schedule: ${cronExp}`);
    createPostgresDump();
  });
});

logger.info(
  `Backup service started with the following database connection details:
  Host: ${PG_HOST}
  Port: ${PG_PORT}
  User: ${PG_USER}
  Database: ${PG_DATABASE}
  S3 Bucket: ${S3_BUCKET_NAME}
  S3 Prefix: ${S3_PREFIX}`
);

schedules.forEach((cronExp) => {
  const humanReadable = cronToText(cronExp);
  logger.info(`Cron schedule: "${cronExp}" - ${humanReadable}`);
});
