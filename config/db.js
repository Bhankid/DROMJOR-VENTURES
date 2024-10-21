// config/db.js
const mysql = require("mysql2");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create the MySQL connection pool
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  // Optional: Add other settings like timeout, connection limit, etc., if needed
});

// Function to connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the MySQL Database:", err.message);
    process.exit(1); // Exit if there's an error
  } else {
    console.log("MySQL Database connected successfully!");
  }
});

// Export the connection to use it in other files
module.exports = connection;
