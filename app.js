const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const db = require("./config/db");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Serve static files from the Dashboard folder
app.use("/Dashboard", express.static(path.join(__dirname, "Dashboard")));

// Route to serve login.html from the Dashboard folder
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "Dashboard", "login.html"));
});

// Route to serve dashboard.html from the Dashboard folder
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "Dashboard", "dashboard.html"));
});

// Route to handle login submissions
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Check if user exists in the database
  const query = "SELECT * FROM login WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred. Please try again later." });
    }

    // If the user is not found
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = results[0];
    try {
      // Compare the provided password with the stored hash
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      // If login is successful
      res.json({ message: "Login successful!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred. Please try again later." });
    }
  });
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "Dashboard", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Featured Products route
app.post("/api/add-featured-product", upload.single("image"), (req, res) => {
  try {
    const { productName, category, description, productId, isFeatured } =
      req.body;
    const imagePath = req.file
      ? `/Dashboard/uploads/${req.file.filename}`
      : null;

    if (!productName || !category || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if 'is_featured' column exists
    db.query(
      "SHOW COLUMNS FROM featured_products LIKE 'is_featured'",
      (err, result) => {
        if (err) {
          console.error("Error checking for is_featured column:", err);
          return res
            .status(500)
            .json({ error: "Database error", details: err.message });
        }

        let query;
        let values;

        if (result.length > 0) {
          // 'is_featured' column exists
          query = `
          INSERT INTO featured_products (product_name, category, description, image,  product_id, is_featured)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
          values = [
            productName,
            category,
            description,
            imagePath,
            productId,
            isFeatured === "true" ? 1 : 0,
          ];
        } else {
          // 'is_featured' column doesn't exist
          query = `
          INSERT INTO featured_products (product_name, category, description, image, product_id)
          VALUES (?, ?, ?, ?, ?)
        `;
          values = [productName, category, description, imagePath, productId];
        }

        db.query(query, values, (err, result) => {
          if (err) {
            console.error("Error inserting product:", err);
            return res
              .status(500)
              .json({ error: "Failed to add product", details: err.message });
          }
          res.status(201).json({
            message: "Product added successfully",
            productId: result.insertId,
            imagePath: imagePath,
          });
        });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    res
      .status(500)
      .json({ error: "An unexpected error occurred", details: error.message });
  }
});

// Get featured products to front end
app.get("/api/featured-products", (req, res) => {
  const query = `
    SELECT * FROM featured_products 
    WHERE is_featured = 1 
    OR category IS NOT NULL
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching featured products:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching featured products" });
    }
    res.json(results);
  });
});

// Endpoint for featured product deletion
app.delete("/api/delete-featured-product/:id", (req, res) => {
  const productId = req.params.id;

  // SQL query to delete the product
  const query = "DELETE FROM featured_products WHERE product_id = ?";

  db.query(query, [productId], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res
        .status(500)
        .json({ error: "Failed to delete product", details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  });
});

// Catch-all error handler to ensure all errors return JSON
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Something went wrong!", details: err.message });
});

//Cart

// Add to cart endpoint
app.post("/api/add-to-cart", (req, res) => {
  try {
    const { image, name, quantity, amount } = req.body;

    // Validate required fields
    if (!name || !quantity || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const query = `
      INSERT INTO cart (image, name, quantity, amount)
      VALUES (?, ?, ?, ?)
    `;

    const values = [image, name, quantity, amount];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error adding item to cart:", err);
        return res.status(500).json({
          error: "Failed to add item to cart",
          details: err.message,
        });
      }

      res.status(201).json({
        message: "Item added to cart successfully",
        cartItemId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({
      error: "An unexpected error occurred",
      details: error.message,
    });
  }
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
