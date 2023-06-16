# express-crud-microservice
This is a microservice built with Express in Node.js for managing products with CRUD operations (Create, Read, Update, Delete) for product items with SQLite as Database.

## Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

4. The server will start running on `http://localhost:3000`.

## API Documentation

The API is documented using Swagger/OpenAPI Specification. You can access the API documentation at `http://localhost:3000/api-docs` when the server is running.

## Endpoints

- **POST /products**: Create a new product.
- **GET /products/:id**: Get a product by ID.
- **PUT /products/:id**: Update a product by ID.
- **DELETE /products/:id**: Delete a product by ID.

## Testing

```
npm test
```

## License

This project is licensed under the [MIT License](LICENSE).
