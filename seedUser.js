const bcrypt = require("bcrypt");
const db = require("./config/db"); // Database connection configuration file

const email = "dromjorventures@gmail.com";
const password = "dromjorsmanage@124";

// Hash the password
bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;

  // Insert the user into the login table
  const query = "INSERT INTO login (email, password_hash) VALUES (?, ?)";
  db.query(query, [email, hash], (error, results) => {
    if (error) {
      console.error("Error inserting user:", error);
      return;
    }
    console.log("User created with ID:", results.insertId);
    process.exit();
  });
});
