const connectDB = require('../config/db');
const { reseedAllWords } = require('../services/wordSeedService');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing words...');
    const count = await reseedAllWords();
    console.log(`Successfully seeded ${count} words!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
