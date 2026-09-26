const mongoose = require('mongoose');
const { getEnv, isServerlessRuntime } = require('./env');

function mustUseRemoteDatabase() {
  return getEnv('NODE_ENV') === 'production' || isServerlessRuntime();
}

function assertProductionEnv() {
  if (!mustUseRemoteDatabase()) {
    return;
  }

  const missing = [];
  if (!getEnv('MONGODB_URI')?.trim()) {
    missing.push('MONGODB_URI');
  }
  if (!getEnv('JWT_SECRET')?.trim()) {
    missing.push('JWT_SECRET');
  }

  if (missing.length === 0) {
    return;
  }

  const err = new Error(
    `Missing required environment variable(s): ${missing.join(', ')}. ` +
      'In Netlify: Site configuration → Environment variables → add them for all scopes, then redeploy.'
  );
  err.code = 'MISSING_ENV';
  err.missingEnv = missing;
  throw err;
}

function getMongoUri() {
  assertProductionEnv();

  const uri = getEnv('MONGODB_URI')?.trim();
  if (uri) {
    if (
      mustUseRemoteDatabase() &&
      (uri.includes('127.0.0.1') || uri.includes('localhost'))
    ) {
      const err = new Error(
        'MONGODB_URI points to localhost. On Netlify use your MongoDB Atlas mongodb+srv:// connection string.'
      );
      err.code = 'INVALID_MONGODB_URI';
      throw err;
    }
    return uri;
  }

  // Local machine (not Netlify/production): default Mongo even without MONGODB_URI in .env
  if (!mustUseRemoteDatabase()) {
    return 'mongodb://127.0.0.1:27017/LoginFormPractice';
  }

  const err = new Error(
    'MONGODB_URI is not set. Netlify cannot use localhost MongoDB. ' +
      'Add your Atlas connection string under Site configuration → Environment variables, then trigger a new deploy.'
  );
  err.code = 'MISSING_MONGODB_URI';
  throw err;
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
