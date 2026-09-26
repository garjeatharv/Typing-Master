/**
 * Smoke checks for Netlify/serverless bootstrap (no Atlas required).
 * Run: npm run verify:netlify
 */
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

async function main() {
  process.env.AWS_LAMBDA_FUNCTION_NAME = 'typing-master-verify';
  delete process.env.MONGODB_URI;
  delete process.env.JWT_SECRET;

  const { getProjectRoot, isServerlessRuntime } = require('../src/config/env');
  const { assertProductionEnv } = require('../src/config/db');

  assert.equal(isServerlessRuntime(), true, 'should detect serverless runtime');

  let missingEnvThrown = false;
  try {
    assertProductionEnv();
  } catch (err) {
    missingEnvThrown = true;
    assert.equal(err.code, 'MISSING_ENV');
    assert.ok(err.message.includes('MONGODB_URI'));
  }
  assert.equal(missingEnvThrown, true, 'should require env vars on serverless');

  const root = getProjectRoot();
  const homeTemplate = path.join(root, 'templates', 'home.hbs');
  assert.ok(fs.existsSync(homeTemplate), `templates must resolve (checked ${homeTemplate})`);

  process.env.JWT_SECRET = 'verify-test-secret-min-32-characters';
  process.env.MONGODB_URI = 'mongodb+srv://example:pass@cluster.example.mongodb.net/typingmaster';

  const app = require('../src/index');
  assert.ok(app.bootstrapReady, 'app should export bootstrapReady');

  await app.bootstrapReady;

  console.log('verify:netlify OK');
  console.log(`  project root: ${root}`);
  console.log(`  templates: ${homeTemplate}`);
}

main().catch((err) => {
  console.error('verify:netlify FAILED:', err.message);
  process.exit(1);
});
