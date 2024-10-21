const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const db = require("./config/db");
const path = require("path");

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Route to serve login.html from the Dashboard folder
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "Dashboard", "login.html"));
});

// Route to serve dashboard.html from the Dashboard folder
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "Dashboard", "dashboard.html"));
});

// Route to handle login submissions
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if user exists in the database
  const query = "SELECT * FROM login WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Server error" });
    }

    // If the user is not found
    if (results.length === 0) {
      console.log("User not found for email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];
    try {
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        console.log("Password mismatch for user:", email);
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // If login is successful, return success message
      console.log("Login successful for user:", email);
      res.json({ message: "Login successful!" });
    } catch (error) {
      console.error("Bcrypt comparison error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
});

// Connect to the database and start the server
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL Database:", err);
    process.exit(1); // Exit if there's an error
  }

  console.log("MySQL Database connected successfully!");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
