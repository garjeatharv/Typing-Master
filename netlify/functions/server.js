const serverless = require('serverless-http');
const app = require('../../src/index');

let server;

async function getServer() {
  if (!server) {
    await app.dbReady;
    server = serverless(app);
  }
  return server;
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const handle = await getServer();
  return handle(event, context);
};
