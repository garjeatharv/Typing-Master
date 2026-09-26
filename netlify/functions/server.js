const serverless = require('serverless-http');

let appModule;
let server;
let initError;

function loadApp() {
  if (!appModule) {
    appModule = require('../../src/index');
  }
  return appModule;
}

function configurationHelpPage(error) {
  const isMissingEnv =
    error.code === 'MISSING_ENV' ||
    error.code === 'MISSING_MONGODB_URI' ||
    error.code === 'INVALID_MONGODB_URI';
  const isMongo = error.name === 'MongooseServerSelectionError';

  const title = isMissingEnv
    ? 'Database not configured on Netlify'
    : isMongo
      ? 'Cannot reach MongoDB'
      : 'Server startup failed';

  const detail = String(error.message || 'Unknown error')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TypingMaster — setup required</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f1419; color: #e7ecf1; margin: 0; padding: 2rem; line-height: 1.5; }
    main { max-width: 42rem; margin: 0 auto; }
    h1 { font-size: 1.35rem; margin-bottom: 0.5rem; }
    p, li { color: #b8c5d3; }
    code { background: #1a2332; padding: 0.15rem 0.4rem; border-radius: 4px; }
    ol { padding-left: 1.25rem; }
    .box { background: #1a2332; border: 1px solid #2d3a4d; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
  </style>
</head>
<body>
  <main>
    <h1>${title}</h1>
    <div class="box"><strong>Details:</strong> ${detail}</div>
    <p>Netlify needs Atlas and two environment variables:</p>
    <ol>
      <li><code>MONGODB_URI</code> — Atlas <code>mongodb+srv://...</code> (all scopes)</li>
      <li><code>JWT_SECRET</code> — unique random string (all scopes)</li>
      <li>Atlas Network Access → <code>0.0.0.0/0</code></li>
      <li>Then <strong>Trigger deploy</strong> on Netlify</li>
    </ol>
  </main>
</body>
</html>`;
}

function isConfigOrMongoError(error) {
  return (
    error.code === 'MISSING_ENV' ||
    error.code === 'MISSING_MONGODB_URI' ||
    error.code === 'INVALID_MONGODB_URI' ||
    error.name === 'MongooseServerSelectionError'
  );
}

async function getServer() {
  if (initError) {
    throw initError;
  }
  if (server) {
    return server;
  }

  try {
    const app = loadApp();
    await app.bootstrapReady;
    server = serverless(app);
    return server;
  } catch (error) {
    initError = error;
    throw error;
  }
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const handle = await getServer();
    return await handle(event, context);
  } catch (error) {
    console.error('Netlify function error:', error);

    if (isConfigOrMongoError(error)) {
      return {
        statusCode: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: configurationHelpPage(error),
      };
    }

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'Internal server error. Check Netlify function logs.',
    };
  }
};
