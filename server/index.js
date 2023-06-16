const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Swagger options
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Product API',
        version: '1.0.0',
        description: 'API documentation for the Product API',
      },
    },
    apis: ['index.js'], // Path to the API route files
  };
  
  // Initialize Swagger-jsdoc
  const swaggerSpecs = swaggerJSDoc(swaggerOptions);
  
  // Serve Swagger API documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Database path
const databasePath = path.join(__dirname, 'database.sqlite');

// Function to clear the database
function clearDatabase() {
  fs.writeFileSync(databasePath, '');
  // Additional logic to recreate the necessary tables or schema can be added here
}

// Clear the database before starting the server
clearDatabase();

// Connect to SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
});

// Define the Product model
const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

// Create the products table if it doesn't exist
Product.sync();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Product ID
 *         name:
 *           type: string
 *           description: Product name
 *         price:
 *           type: number
 *           description: Product price
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
app.post('/products', async (req, res) => {
    const { name, price } = req.body;

    try {
        const newProduct = await Product.create({ name, price });
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: 'Unable to create product' });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(product);
        }
    } catch (err) {
        res.status(500).json({ error: 'Unable to retrieve product' });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
app.put('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const { name, price } = req.body;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            product.name = name;
            product.price = price;
            await product.save();
            res.json(product);
        }
    } catch (err) {
        res.status(500).json({ error: 'Unable to update product' });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
app.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            await product.destroy();
            res.json({ message: 'Product deleted successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Unable to delete product' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;