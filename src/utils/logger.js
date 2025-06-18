import winston from 'winston';
import 'winston-daily-rotate-file';

/**
 * Winston transport for logging messages to daily rotated log files.
 *
 * - Logs are saved in the 'logs' directory with filenames following the pattern 'backup-YYYY-MM-DD.log'.
 * - Each log file contains logs for a single day, as specified by the 'datePattern'.
 * - Keeps log files for the last 14 days (`maxFiles: '14d'`).
 * - Older log files are compressed (`zippedArchive: true`).
 *
 * @type {import('winston-transport')}
 */
const transport = new winston.transports.DailyRotateFile({
  filename: 'logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  zippedArchive: true,
});

/**
 * Logger instance configured with timestamped and formatted output.
 * Uses Console and a custom transport for logging.
 *
 * @type {import('winston').Logger}
 */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [new winston.transports.Console(), transport],
});

export default logger;
