const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

let mongoServer;
let client;
let db;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  client = new MongoClient(mongoUri);
  await client.connect();
  db = client.db('testdb');
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

describe('Todo operations', () => {
  it('should insert a todo', async () => {
    const todos = db.collection('todos');
    const mockTodo = { title: 'Test todo', completed: false };
    await todos.insertOne(mockTodo);
    const insertedTodo = await todos.findOne({ title: 'Test todo' });
    expect(insertedTodo).toMatchObject(mockTodo);
  });

  it('should retrieve todos', async () => {
    const todos = db.collection('todos');
    const mockTodos = [
      { title: 'Todo 1', completed: false },
      { title: 'Todo 2', completed: true }
    ];
    await todos.insertMany(mockTodos);
    const retrievedTodos = await todos.find().toArray();
    expect(retrievedTodos.length).toBeGreaterThanOrEqual(2);
  });
});