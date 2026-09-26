const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');

process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/TypingMasterTest';

const app = require('../src/index');

const Word = require('../src/models/Word');

describe('API integration', () => {
  before(async () => {
    await app.dbReady;
    await mongoose.connection.db.dropDatabase();
  });

  after(async () => {
    await mongoose.connection.close();
  });

  test('signup, login, save session, read stats', async () => {
    const agent = request.agent(app);

    const signup = await agent
      .post('/api/auth/signup')
      .send({ name: 'testuser', password: 'secret' })
      .expect(201);

    assert.equal(signup.body.success, true);

    const login = await agent
      .post('/api/auth/login')
      .send({ name: 'testuser', password: 'secret' })
      .expect(200);

    assert.equal(login.body.success, true);

    const session = await agent
      .post('/api/sessions')
      .send({
        mode: 'words',
        category: 'Coding',
        wordCount: 10,
        durationSeconds: 30,
        correctChars: 40,
        totalChars: 42,
        errorCount: 2,
      })
      .expect(201);

    assert.equal(session.body.data.wpm, 16);
    assert.equal(session.body.data.accuracy, 95);

    const stats = await agent.get('/api/sessions/stats').expect(200);
    assert.equal(stats.body.data.totalSessions, 1);
    assert.equal(stats.body.data.bestWpm, 16);
  });

  test('words endpoint requires auth', async () => {
    await request(app).get('/api/words?category=Coding&count=5').expect(401);
  });

  test('Random category samples across word categories', async () => {
    await Word.insertMany([
      { word: 'alpha', category: 'Coding', length: 5 },
      { word: 'beta', category: 'Animals', length: 4 },
      { word: 'gamma', category: 'Things', length: 5 },
    ]);

    const agent = request.agent(app);
    await agent.post('/api/auth/signup').send({ name: 'randomuser', password: 'secret' });

    const res = await agent.get('/api/words?category=Random&count=3').expect(200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 3);

    const randomSession = await agent
      .post('/api/sessions')
      .send({
        mode: 'words',
        category: 'Random',
        wordCount: 3,
        durationSeconds: 10,
        correctChars: 15,
        totalChars: 15,
        errorCount: 0,
      })
      .expect(201);

    assert.equal(randomSession.body.data.category, 'Random');
  });
});
