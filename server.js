const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

let db;

// Function to connect to the database
const connectToDatabase = async (url) => {
  const client = new MongoClient(url);
  await client.connect();
  console.log('Connected successfully to MongoDB');
  db = client.db();
  return client;
};

// Define your routes here
app.get('/todos', async (req, res) => {
  const todos = await db.collection('todos').find().toArray();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTodo = { title, completed: false };
  const result = await db.collection('todos').insertOne(newTodo);
  res.status(201).json({ ...newTodo, _id: result.insertedId });
});

// Export the app and the connectToDatabase function
module.exports = { app, connectToDatabase };