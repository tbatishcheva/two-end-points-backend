const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, connectToDatabase } = require('./server');

let mongoServer;
let client;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  client = await connectToDatabase(mongoUri);
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

describe('Todo API', () => {
  it('GET /todos - should return all todos', async () => {
    const res = await request(app)
      .get('/todos')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('POST /todos - should create a new todo', async () => {
    const newTodo = { title: 'Test todo' };
    const res = await request(app)
      .post('/todos')
      .send(newTodo)
      .expect('Content-Type', /json/)
      .expect(201);
    
    expect(res.body.title).toBe(newTodo.title);
    expect(res.body.completed).toBe(false);
    expect(res.body).toHaveProperty('_id');
  });
});
