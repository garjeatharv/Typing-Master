const serverless = require('serverless-http');
const app = require('../../src/index');

let server;
let initError;

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

  const detail = error.message || 'Unknown error';

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
    <p>To run TypingMaster on Netlify you need a cloud MongoDB (Atlas) and env vars:</p>
    <ol>
      <li>Create a free cluster at <a href="https://www.mongodb.com/cloud/atlas/register" style="color:#7eb8ff">MongoDB Atlas</a>.</li>
      <li>Database Access → create a user with password.</li>
      <li>Network Access → <strong>Add IP Address</strong> → <code>0.0.0.0/0</code> (allow Netlify).</li>
      <li>Connect → Drivers → copy URI (looks like <code>mongodb+srv://...</code>).</li>
      <li>Netlify → <strong>Site configuration → Environment variables</strong>:
        <ul>
          <li><code>MONGODB_URI</code> = your Atlas URI (replace <code>&lt;password&gt;</code>)</li>
          <li><code>JWT_SECRET</code> = long random string (not copied from this repo)</li>
        </ul>
      </li>
      <li>Scope: set both variables for <strong>All scopes</strong> (or at least Production + Functions).</li>
      <li><strong>Deploys → Trigger deploy</strong> (required after changing env vars).</li>
    </ol>
    <p>Word lists seed automatically on first successful connection.</p>
  </main>
</body>
</html>`;
}

async function getServer() {
  if (initError) {
    throw initError;
  }
  if (server) {
    return server;
  }

  try {
    await app.dbReady;
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
    return handle(event, context);
  } catch (error) {
    console.error('Netlify function startup failed:', error);

    return {
      statusCode: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: configurationHelpPage(error),
    };
  }
};
