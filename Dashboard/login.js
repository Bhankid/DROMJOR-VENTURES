document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        window.location.href = "/dashboard";
      } else {
        alert(data.error || "Invalid login credentials. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    }
  });
