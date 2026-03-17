# Daily Jobs - Mini Project

This project requires Node.js and MongoDB to run locally.

## Prerequisites
1. **Node.js**: The server depends on Node.js to run.
2. **MongoDB**: The server uses MongoDB for storing users, jobs, and applications. Ensure MongoDB is running locally on port `27017`.

## Running the Application

1. Open a terminal in this directory (`daily-jobs`).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   *Note: If MongoDB is missing, you will see a `MongoNetworkError` in the console.*
4. Open your web browser and navigate to: `http://localhost:3000`

## Implementation Details
- See `project.md` for the college report.
- The entry point is `server.js` and frontend assets are in `public/`.
