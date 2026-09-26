const { sendError } = require('../utils/httpResponse');
const { getEnv } = require('../config/env');

function notFound(req, res) {
  if (req.originalUrl.startsWith('/api')) {
    return sendError(res, 404, 'Resource not found');
  }
  return res.status(404).render('pageNotFount');
}

function errorHandler(err, req, res, _next) {
  console.error(err.stack || err.message);

  const configError =
    err.code === 'MISSING_ENV' ||
    err.code === 'MISSING_MONGODB_URI' ||
    err.code === 'INVALID_MONGODB_URI' ||
    err.name === 'MongooseServerSelectionError';

  if (req.originalUrl.startsWith('/api')) {
    const status = configError ? 503 : err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return sendError(res, status, message);
  }

  if (configError) {
    return res.status(503).render('error', {
      message: err.message,
    });
  }

  return res.status(500).render('error', {
    message: getEnv('NODE_ENV') === 'production' ? 'Something went wrong.' : err.message,
  });
}

module.exports = { notFound, errorHandler };
