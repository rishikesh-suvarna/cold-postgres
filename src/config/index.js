import 'dotenv/config';

function getEnvVar(name, required = true) {
  const value = process.env[name];
  if (required && (value === undefined || value.trim() === '')) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const PG_HOST = getEnvVar('PG_HOST');
export const PG_PORT = parseInt(getEnvVar('PG_PORT'), 10);
export const PG_USER = getEnvVar('PG_USER');
export const PG_PASSWORD = getEnvVar('PG_PASSWORD', false);
export const PG_DATABASE = getEnvVar('PG_DATABASE');

export const AWS_ACCESS_KEY_ID = getEnvVar('AWS_ACCESS_KEY_ID');
export const AWS_SECRET_ACCESS_KEY = getEnvVar('AWS_SECRET_ACCESS_KEY');
export const AWS_REGION = getEnvVar('AWS_REGION');

export const S3_BUCKET_NAME = getEnvVar('S3_BUCKET_NAME');
export const S3_PREFIX = getEnvVar('S3_PREFIX', false) || 'pg_dumps';

export const CRON_SCHEDULES = getEnvVar('CRON_SCHEDULES')
  ?.split(',')
  .map((s) => s.trim());
