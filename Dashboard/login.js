document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    // Get form values
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      // Send POST request to login endpoint
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to dashboard if login is successful
        window.location.href = "/dashboard";
      } else {
        // Display error message if login fails
        alert(data.error || "Invalid login credentials. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    }
  });
