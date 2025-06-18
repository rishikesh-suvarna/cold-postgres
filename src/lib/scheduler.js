import cron from 'node-cron';

import { createBackupDump } from '../utils/createBackupDump.js';
import { CRON_SCHEDULES } from '../config/env.config.js';
import { cronToText } from '../utils/cronsToText.js';
import logger from '../utils/logger.js';

const schedules = CRON_SCHEDULES;
schedules.forEach((cronExp) => {
  if (!cron.validate(cronExp)) {
    logger.warn(`Invalid cron expression: ${cronExp}`);
    return;
  }
  cron.schedule(cronExp, () => {
    logger.info(`Running backup task for schedule: ${cronExp}`);
    createBackupDump();
  });
});

schedules.forEach((cronExp) => {
  const humanReadable = cronToText(cronExp);
  logger.info(`Cron schedule: "${cronExp}" - ${humanReadable}`);
});
