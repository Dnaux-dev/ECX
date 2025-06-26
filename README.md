# ECX Project

A modern web application backend built with Node.js and Express.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ecx-project
   NODE_ENV=development
   ```
4. Create an `uploads` directory in the root folder:
   ```bash
   mkdir uploads
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── index.js        # Application entry point
├── uploads/            # File upload directory
├── .env               # Environment variables
├── package.json       # Project dependencies
└── README.md         # Project documentation
```

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot reload
- `npm test`: Run tests

## API Endpoints

- `GET /`: Welcome message
- More endpoints coming soon...

## Validation & Error Handling
- All major endpoints use Joi validation for request bodies and parameters.
- Centralized error handler returns consistent error responses with proper status codes.

## Running Tests
You can add automated tests using Jest and Supertest:

1. Install dev dependencies:
   npm install --save-dev jest supertest

2. Create a `tests/` directory and add test files (e.g., auth.test.js, jobs.test.js).

3. Add a test script to your package.json:
   "test": "jest"

4. Run tests:
   npm test

## License

ISC 