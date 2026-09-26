/**
 * Bracket access so Netlify/esbuild does not inline build-time values
 * for secrets that are only available at function runtime.
 */
const fs = require('fs');
const path = require('path');

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

function directoryHasTemplates(root) {
  try {
    return fs.existsSync(path.join(root, 'templates', 'home.hbs'));
  } catch {
    return false;
  }
}

/** Resolve project root; Netlify bundles templates next to the function task root. */
function getProjectRoot() {
  const candidates = [];

  if (isServerlessRuntime()) {
    candidates.push(process.cwd());
    candidates.push(path.join(__dirname, '../..'));
    candidates.push(path.join(__dirname, '..'));
  } else {
    candidates.push(path.join(__dirname, '../..'));
  }

  for (const root of candidates) {
    if (directoryHasTemplates(root)) {
      return root;
    }
  }

  return candidates[0];
}

module.exports = { getEnv, isServerlessRuntime, isLocalDevelopment, getProjectRoot };
