/**
 * Bracket access so Netlify/esbuild does not inline build-time values
 * for secrets that are only available at function runtime.
 */
function getEnv(name) {
  return process.env[name];
}

function isServerlessRuntime() {
  return Boolean(
    getEnv('NETLIFY') ||
    getEnv('AWS_LAMBDA_FUNCTION_NAME') ||
    getEnv('LAMBDA_TASK_ROOT') ||
    getEnv('AWS_EXECUTION_ENV') ||
    (getEnv('URL') && String(getEnv('URL')).includes('netlify.app'))
  );
}

function isLocalDevelopment() {
  return getEnv('NODE_ENV') === 'development' && !getEnv('CI') && !isServerlessRuntime();
}

module.exports = { getEnv, isServerlessRuntime, isLocalDevelopment };
