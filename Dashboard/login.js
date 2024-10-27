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
        toastr.success("Login successful!"); 
        setTimeout(() => {
          window.location.href = "/dashboard"; 
        }, 2000);
      } else {
        toastr.error(
          data.error || "Invalid login credentials. Please try again."
        ); // Show error toast
      }
    } catch (error) {
      toastr.error("An error occurred. Please try again later."); // Show error toast
    }
  });


  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-bottom-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "3000",
    extendedTimeOut: "1000",
    showEasing: "easeInBounce",
    hideEasing: "easeOutBounce",
    showMethod: "slideDown",
    hideMethod: "slideUp",
  };