const { sendError } = require('../utils/httpResponse');

function notFound(req, res) {
  if (req.originalUrl.startsWith('/api')) {
    return sendError(res, 404, 'Resource not found');
  }
  return res.status(404).render('pageNotFount');
}

function errorHandler(err, req, res, _next) {
  console.error(err.stack || err.message);

  if (req.originalUrl.startsWith('/api')) {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return sendError(res, status, message);
  }

  return res.status(500).render('error', {
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong.' : err.message,
  });
}

module.exports = { notFound, errorHandler };
