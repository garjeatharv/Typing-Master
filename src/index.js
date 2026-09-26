require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');

const hbs = require('hbs');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const viewRoutes = require('./routes/viewRoutes');
const authRoutes = require('./routes/authRoutes');
const wordRoutes = require('./routes/wordRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();
const port = process.env.PORT || 3000;
const projectRoot = path.join(__dirname, '..');

app.set('trust proxy', 1);

const partialsPath = path.join(projectRoot, 'templates/partials');

function registerAllPartials() {
  return new Promise((resolve, reject) => {
    hbs.registerPartials(partialsPath, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

const partialsReady = registerAllPartials();

if (process.env.NODE_ENV !== 'production') {
  let reloadTimer;
  try {
    fs.watch(partialsPath, { recursive: true }, () => {
      clearTimeout(reloadTimer);
      reloadTimer = setTimeout(() => {
        registerAllPartials().catch((err) => {
          console.error('Failed to reload Handlebars partials:', err.message);
        });
      }, 150);
    });
  } catch (err) {
    console.warn('Handlebars partial watch unavailable:', err.message);
  }
}

const dbReady = connectDB();
const appReady = Promise.all([dbReady, partialsReady]);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'hbs');
app.set('views', path.join(projectRoot, 'templates'));
hbs.registerHelper('eq', (a, b) => a === b);
app.use(express.static(path.join(projectRoot, 'public')));

app.use('/', viewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/sessions', sessionRoutes);

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  appReady
    .then(() => {
      app.listen(port, () => {
        console.log(`TypingMaster listening on http://localhost:${port}`);
      });
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = app;
module.exports.dbReady = appReady;
