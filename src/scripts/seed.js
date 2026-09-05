const mongoose = require('mongoose');
const Word = require('../models/Word');
const connectDB = require('../config/db');

const codingWords = [
  'API', 'Angular', 'Async', 'await', 'axios', 'branch', 'break', 'bug', 'callback', 
  'case', 'catch', 'class', 'clone', 'component', 'concat', 'console', 'continue', 
  'constructor', 'CSS', 'Date', 'Debugging', 'develop', 'DOM', 'else', 'Error', 'ES6', 
  'Event', 'Exception', 'export', 'Express', 'feature', 'fetch', 'finally', 'filter', 
  'forEach', 'fork', 'function', 'Git', 'GitHub', 'HTML', 'if', 'import', 'index', 
  'Inheritance', 'input', 'install', 'instance', 'Integer', 'interface', 'JavaScript', 
  'join', 'JSON', 'key', 'let', 'library', 'lifecycle', 'loop', 'map', 'method', 
  'middleware', 'module', 'MongoDB', 'Mongoose', 'next', 'Node', 'nodemon', 'npm', 
  'object', 'package', 'parameter', 'path', 'pipeline', 'port', 'post', 'Promise', 
  'prototype', 'query', 'React', 'reduce', 'register', 'reject', 'render', 'request', 
  'resolve', 'response', 'route', 'router', 'schema', 'script', 'server', 'session', 
  'signup', 'slice', 'splice', 'start', 'static', 'String', 'submit', 'switch', 
  'template', 'test', 'then', 'throw', 'token', 'try', 'typeof', 'undefined', 
  'validation', 'value', 'var', 'version', 'Vite', 'VSCode', 'while'
];

const animalsWords = [
  'alligator', 'ant', 'bear', 'bee', 'bird', 'bison', 'camel', 'cat', 'cheetah', 
  'chicken', 'chimpanzee', 'cow', 'crab', 'crocodile', 'deer', 'dog', 'dolphin', 
  'donkey', 'duck', 'eagle', 'elephant', 'fish', 'fly', 'fox', 'frog', 'giraffe', 
  'goat', 'gorilla', 'hamster', 'hippopotamus', 'horse', 'kangaroo', 'koala', 
  'leopard', 'lion', 'lizard', 'llama', 'monkey', 'mouse', 'octopus', 'ostrich', 
  'owl', 'panda', 'parrot', 'penguin', 'pig', 'pigeon', 'rabbit', 'rat', 'rhinoceros', 
  'seahorse', 'seal', 'shark', 'sheep', 'snake', 'spider', 'squirrel', 'tiger', 
  'turkey', 'turtle', 'walrus', 'whale', 'wolf', 'zebra'
];

const thingsWords = [
  'bag', 'bed', 'book', 'bookstore', 'bottle', 'carpet', 'chair', 'clock', 'clothes', 
  'coffee', 'computer', 'desk', 'door', 'email', 'exercise', 'flower', 'food', 
  'friend', 'game', 'grass', 'hat', 'holiday', 'home', 'journey', 'key', 'laptop', 
  'letter', 'library', 'love', 'map', 'message', 'mirror', 'money', 'mountain', 
  'movie', 'music', 'notebook', 'ocean', 'paper', 'party', 'pen', 'pencil', 
  'phone', 'photo', 'picture', 'pillow', 'restaurant', 'river', 'road', 'school', 
  'shoes', 'sleep', 'smile', 'sport', 'table', 'telephone', 'television', 'time', 
  'toilet', 'tree', 'umbrella', 'video', 'wallet', 'watch', 'water', 'window', 'work'
];

const placesWords = [
  'Africa', 'America', 'Asia', 'Australia', 'beach', 'bridge', 'building', 'canyon', 
  'castle', 'city', 'country', 'desert', 'Europe', 'forest', 'garden', 'harbor', 
  'house', 'island', 'lake', 'market', 'monument', 'museum', 'office', 'park', 
  'playground', 'plaza', 'river', 'road', 'station', 'street', 'temple', 'tower', 
  'town', 'valley', 'village', 'waterfall'
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing words...');
    await Word.deleteMany({});

    console.log('Seeding words...');
    
    const wordsToInsert = [];

    codingWords.forEach(word => {
      wordsToInsert.push({ word, category: 'Coding', length: word.length });
    });

    animalsWords.forEach(word => {
      wordsToInsert.push({ word, category: 'Animals', length: word.length });
    });

    thingsWords.forEach(word => {
      wordsToInsert.push({ word, category: 'Things', length: word.length });
    });

    placesWords.forEach(word => {
      wordsToInsert.push({ word, category: 'Places', length: word.length });
    });

    await Word.insertMany(wordsToInsert);
    console.log(`Successfully seeded ${wordsToInsert.length} words!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
