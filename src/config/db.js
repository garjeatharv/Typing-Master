const mongoose = require('mongoose');

function isServerlessRuntime() {
  return Boolean(
    process.env.NETLIFY ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT
  );
}

function mustUseRemoteDatabase() {
  return process.env.NODE_ENV === 'production' || isServerlessRuntime();
}

function assertProductionEnv() {
  if (!mustUseRemoteDatabase()) {
    return;
  }

  const missing = [];
  if (!process.env.MONGODB_URI?.trim()) {
    missing.push('MONGODB_URI');
  }
  if (!process.env.JWT_SECRET?.trim()) {
    missing.push('JWT_SECRET');
  }

  if (missing.length === 0) {
    return;
  }

  const err = new Error(
    `Missing required environment variable(s): ${missing.join(', ')}. ` +
      'In Netlify: Site configuration → Environment variables → add them, then redeploy.'
  );
  err.code = 'MISSING_ENV';
  err.missingEnv = missing;
  throw err;
}

function getMongoUri() {
  assertProductionEnv();

  const uri = process.env.MONGODB_URI?.trim();
  if (uri) {
    return uri;
  }

  if (mustUseRemoteDatabase()) {
    const err = new Error(
      'MONGODB_URI is not set. Netlify cannot use localhost MongoDB. ' +
        'Create a free MongoDB Atlas cluster and paste the connection string into Netlify env vars.'
    );
    err.code = 'MISSING_MONGODB_URI';
    throw err;
  }

  return 'mongodb://127.0.0.1:27017/LoginFormPractice';
}

let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = getMongoUri();

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 15000,
        maxPoolSize: 10,
      })
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;
module.exports.assertProductionEnv = assertProductionEnv;
module.exports.isServerlessRuntime = isServerlessRuntime;
