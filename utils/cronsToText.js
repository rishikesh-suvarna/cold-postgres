import cronstrue from 'cronstrue';

/**
 * Converts a cron string to a human-readable string.
 * @param {string} cronString - A valid cron expression.
 * @returns {string} Human-readable description.
 */
export function cronToText(cronString) {
  try {
    return cronstrue.toString(cronString);
  } catch (err) {
    return `Invalid cron expression: "${cronString}"`;
  }
}
