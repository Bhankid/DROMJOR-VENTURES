document.addEventListener("DOMContentLoaded", () => {
  // Sidebar toggle functionality
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");
  const menuToggle = document.getElementById("menu-toggle");

  // Toggle the sidebar and adjust content area
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
    content.classList.toggle("shifted");
  });

  // Sidebar navigation functionality
  const sidebarLinks = document.querySelectorAll(".sidebar a");
  const contentSections = document.querySelectorAll(".content-1");

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      // Remove the 'active' class from all sidebar links
      sidebarLinks.forEach((link) => link.classList.remove("active"));

      // Add the 'active' class to the clicked link
      this.classList.add("active");

      // Hide all content sections
      contentSections.forEach((section) => {
        section.classList.remove("active");
        section.style.display = "none";
      });

      // Get the associated content section using data-id
      const targetSection = document.querySelector(
        `.content-1[data-id="${this.querySelector("i").dataset.id}"]`
      );

      // Show the associated content section
      if (targetSection) {
        targetSection.classList.add("active");
        targetSection.style.display = "block";
      }
    });
  });

  // Initially show only the section with 'active' class
  const initialActiveSection = document.querySelector(".content-1.active");
  if (initialActiveSection) {
    initialActiveSection.style.display = "block";
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const statusSelects = document.querySelectorAll("select.status-select");

  function updateSelectStyle(select) {
    if (select.value === "paid") {
      select.classList.remove("pending");
      select.classList.add("paid");
    } else if (select.value === "pending") {
      select.classList.remove("paid");
      select.classList.add("pending");
    }
  }

  // Initial style update
  statusSelects.forEach(updateSelectStyle);

  // Update style on change
  statusSelects.forEach(function (select) {
    select.addEventListener("change", function () {
      updateSelectStyle(select);
    });
  });
});




 const fileInput = document.getElementById("file-input");
 const fileNameSpan = document.getElementById("file-name");

 fileInput.addEventListener("change", function () {
   // Check if a file has been selected
   if (fileInput.files.length > 0) {
     // Get the name of the selected file
     const fileName = fileInput.files[0].name;
     // Update the span text to the file name
     fileNameSpan.textContent = fileName;
   } else {
     // Reset to default text if no file is selected
     fileNameSpan.textContent = "No file chosen";
   }
 });



