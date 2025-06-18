import { exec } from 'child_process';
import { createReadStream, unlink } from 'fs';
import { promisify } from 'util';
import moment from 'moment';

import logger from './logger.js';
import { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE, S3_BUCKET_NAME, S3_PREFIX } from '../config/index.js';
import { uploadToStorage } from '../lib/storage.js';

const execAsync = promisify(exec);

export const createBackupDump = async () => {
  const FORMATTED_TIMESTAMP = moment().format('YYYYMMDD_HHmmss');
  const DUMP_FILE = `/tmp/db_backup_${FORMATTED_TIMESTAMP}.sql`;
  const KEY = `${S3_PREFIX}/db_backup_${FORMATTED_TIMESTAMP}.sql`;

  const cmd = `PGPASSWORD="${PG_PASSWORD}" pg_dump -h ${PG_HOST} -p ${PG_PORT} -U ${PG_USER} -d ${PG_DATABASE} -F p -f ${DUMP_FILE}`;
  if (process.env.NODE_ENV === 'development') {
    logger.info(`Executing command: ${cmd}`);
  }

  try {
    await execAsync(cmd);

    const fileStream = createReadStream(DUMP_FILE);
    await uploadToStorage(S3_BUCKET_NAME, KEY, fileStream);

    logger.info(`Backup successful: ${KEY} uploaded to S3 bucket ${S3_BUCKET_NAME}`);
  } catch (error) {
    logger.error(`Backup failed: ${error.message}`);
  } finally {
    try {
      unlink(DUMP_FILE, () => {});
      logger.info(`Local dump file deleted: ${DUMP_FILE}`);
    } catch (error) {
      logger.error(`Failed to delete local dump file: ${error.message}`);
    }
  }
};
