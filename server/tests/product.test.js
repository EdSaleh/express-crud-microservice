const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app');


const databasePath = path.join(__dirname, '..', 'database.sqlite');

function waitForDatabase() {
  return new Promise((resolve, reject) => {
    const timeout = 5000; // Adjust the timeout as needed
    const interval = 200; // Adjust the interval as needed
    let elapsedTime = 0;

    const checkDatabase = setInterval(() => {
      if (fs.existsSync(databasePath)) {
        clearInterval(checkDatabase);
        resolve();
      } else {
        elapsedTime += interval;
        if (elapsedTime >= timeout) {
          clearInterval(checkDatabase);
          reject(new Error('Timeout: Database file not found'));
        }
        console.log('Waiting for database file to be created...');
      }
    }, interval);
  });
}

describe('Product API', () => {

  // Run this before all tests
  beforeAll(async () => {
    // Perform any setup tasks, such as waiting for the database file to be created
    await waitForDatabase();
  });

  // Test for creating a new product
  test('POST /products', async () => {
    const response = await request(app)
      .post('/products')
      .send({ name: 'Sample Product', price: 10 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Sample Product');
    expect(response.body.price).toBe(10);
  });

  // Test for getting a product by ID
  test('GET /products/:id', async () => {
    const response = await request(app).get('/products/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('price');
  });

  // Test for updating a product by ID
  test('PUT /products/:id', async () => {
    const response = await request(app)
      .put('/products/1')
      .send({ name: 'Updated Product', price: 20 });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Product');
    expect(response.body.price).toBe(20);
  });

  // Test for deleting a product by ID
  test('DELETE /products/:id', async () => {
    const response = await request(app).delete('/products/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Product deleted successfully');
  });
});
