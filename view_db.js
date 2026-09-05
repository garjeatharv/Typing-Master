const mongoose = require('mongoose');

async function viewDb() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/LoginFormPractice');
    console.log('=== CONNECTED TO LOCAL MONGODB ===\n');
    
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Databases on Local MongoDB Server:');
    dbs.databases.forEach(db => console.log(` - ${db.name} (${(db.sizeOnDisk / 1024).toFixed(2)} KB)`));
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in "LoginFormPractice" database:');
    if (collections.length === 0) {
      console.log(' (No collections found yet. Database collection will be created on first user signup/login)');
    } else {
      for (let col of collections) {
        const docs = await mongoose.connection.db.collection(col.name).find({}).toArray();
        console.log(`\nCollection: '${col.name}' (${docs.length} documents):`);
        console.log(JSON.stringify(docs, null, 2));
      }
    }
  } catch (err) {
    console.error('Error querying MongoDB:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

viewDb();
