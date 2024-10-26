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
    // Remove all classes first to ensure only one is applied
    select.classList.remove("paid", "pending", "partially");

    if (select.value === "paid") {
      select.classList.add("paid");
    } else if (select.value === "pending") {
      select.classList.add("pending");
    } else if (select.value === "part") {
      select.classList.add("partially");
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

// Invoice Pop Up
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("invoiceModal");
  const btn = document.querySelector('[data-id="invoice"] .btn'); // Select the button within the section
  const span = document.getElementById("closeModal");

  // Open the modal when the button is clicked
  btn.onclick = function () {
    modal.style.display = "block";
  };

  // Close the modal when the close button is clicked
  span.onclick = function () {
    modal.style.display = "none";
  };

  // Close the modal when clicking outside of the modal content
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  // Handle form submission
  document.getElementById("invoiceForm").onsubmit = function (event) {
    event.preventDefault();
    // Handle form submission logic here
    alert("Invoice created!");
    modal.style.display = "none"; // Close modal after submission
  };
});

// Add category pop up
document.addEventListener("DOMContentLoaded", () => {
  const popupMenu = document.getElementById("popupMenu");
  const addCategoryBtn = document.getElementById("addCategoryBtn");
  const closePopup = document.getElementById("closePopup");
  const submitBtn = document.getElementById("submitBtn");

  // Show the popup when the button is clicked
  addCategoryBtn.onclick = function () {
    popupMenu.style.display = "block";
  };

  // Close the popup when the close button is clicked
  closePopup.onclick = function () {
    popupMenu.style.display = "none";
  };

  // Close the popup when clicking outside of the popup content
  window.onclick = function (event) {
    if (event.target === popupMenu) {
      popupMenu.style.display = "none";
    }
  };

  // Handle the submit button click
  submitBtn.onclick = function () {
    const name = document.getElementById("name").value;
    const lastUpdated = document.getElementById("lastUpdated").value;

    // You can process the input values here
    console.log(`Name: ${name}, Last Updated: ${lastUpdated}`);

    // Optionally, close the popup after submission
    popupMenu.style.display = "none";
  };
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

// Generate product ids
class ProductIdGenerator {
  constructor() {
    this.usedIds = new Set();
    this.minValue = 50;
  }

  generate() {
    let newId;
    do {
      newId = Math.floor(Math.random() * 9990) + this.minValue;
    } while (this.usedIds.has(newId));

    this.usedIds.add(newId);
    return `PRD${newId}`;
  }

  isIdUsed(id) {
    return this.usedIds.has(id);
  }

  releaseId(id) {
    this.usedIds.delete(id);
  }
}
// Initialize the generator
const idGenerator = new ProductIdGenerator();

document.addEventListener("DOMContentLoaded", function () {
  const featuredProductsTable = document.getElementById(
    "featuredProductsTable"
  );

  if (featuredProductsTable) {
    featuredProductsTable.addEventListener("click", function (e) {
      if (e.target && e.target.classList.contains("delete-icon")) {
        const row = e.target.closest("tr");
        const productId = row.dataset.productId;

        if (confirm("Are you sure you want to delete this product?")) {
          // Remove from the table
          row.remove();

          // Remove from localStorage
          let products =
            JSON.parse(localStorage.getItem("featuredProducts")) || [];
          products = products.filter(
            (product) => product.productId !== productId
          );
          localStorage.setItem("featuredProducts", JSON.stringify(products));

          // Call the API to delete the product
          fetch(`/api/delete-featured-product/${productId}`, {
            method: "DELETE",
          })
            .then(async (response) => {
              const contentType = response.headers.get("content-type");
              if (
                contentType &&
                contentType.indexOf("application/json") !== -1
              ) {
                // Response is JSON
                return response.json().then((data) => {
                  if (!response.ok)
                    throw new Error(data.error || "Failed to delete product");
                  return data;
                });
              } else {
                // **Add Debugging:** Response is not JSON, log it for further investigation
                const text = await response.text();
                console.error("Non-JSON response received:", text);
                throw new Error(
                  `Received non-JSON response: ${text.substring(0, 100)}...`
                );
              }
            })
            .then((data) => {
              alert(data.message);
            })
            .catch((err) => {
              console.error("Error deleting product:", err);
              alert(
                `Failed to delete product. Please try again.\nError: ${err.message}`
              );
            });
        }
      }
    });
  }
});

// New function to save featured products to localStorage
function saveFeaturedProductsToLocalStorage(product) {
  let products = JSON.parse(localStorage.getItem("featuredProducts")) || [];
  products.push(product);
  localStorage.setItem("featuredProducts", JSON.stringify(products));
}

//  function to load featured products from localStorage
function loadFeaturedProductsFromLocalStorage() {
  const products = JSON.parse(localStorage.getItem("featuredProducts")) || [];
  products.forEach((product) => {
    addProductToTable(
      product.name,
      product.category,
      product.description,
      product.imagePath,
      product.productId,
      product.isFeatured
    );
  });
}

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get references to the form elements
  const form = document.getElementById("featuredProductForm");
  const productName = document.getElementById("product-name");
  const category = document.getElementById("category");
  const description = document.getElementById("description");
  const fileInput = document.getElementById("file-input");
  const addProductBtn = document.querySelector(".add-product-btn");
  const isFeaturedCheckbox = document.querySelector(".is-featured-checkbox");
  const featuredProductsTable = document.getElementById(
    "featuredProductsTable"
  );
  const fileNameSpan = document.getElementById("file-name");

  // Load featured products from localStorage
  loadFeaturedProductsFromLocalStorage();

  // Add click event listener to the "Add Product" button
  addProductBtn.addEventListener("click", function () {
    // Get the values from the form
    const name = productName.value;
    const cat = category.value;
    const desc = description.value;
    const file = fileInput.files[0];
    idGenerator.generate();
    const isFeatured = isFeaturedCheckbox.checked;

    // Generate a unique product ID
    const productId = idGenerator.generate();

    // Create FormData object for sending to server
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("productName", name);
    formData.append("category", cat);
    formData.append("description", desc);
    formData.append("image", file);
    formData.append("isFeatured", isFeatured);

    // Send the form data to the server
    fetch("/api/add-featured-product", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          // Response is JSON
          return response.json().then((data) => {
            if (!response.ok)
              throw new Error(data.error || "Failed to add product");
            return data;
          });
        } else {
          // **Add Debugging:** Response is not JSON, log it for further investigation
          const text = await response.text();
          console.error("Non-JSON response received:", text);
          throw new Error(
            `Received non-JSON response: ${text.substring(0, 100)}...`
          );
        }
      })
      .then((data) => {
        alert(data.message);

        // Add the product to the table
        addProductToTable(
          name,
          cat,
          desc,
          data.imagePath,
          productId,
          isFeatured
        );

        // Save to localStorage
        saveFeaturedProductsToLocalStorage({
          name,
          category: cat,
          description: desc,
          imagePath: data.imagePath,
          productId,
          isFeatured,
        });

        clearForm();
      })
      .catch((err) => {
        console.error("Error adding product:", err);
        // If there's an error, release the ID so it can be used again
        idGenerator.releaseId(productId);
        alert(
          "Failed to add product. Please try again.\nError: " + err.message
        );
      });
  });
});

// Function to add a product to the table
function addProductToTable(name, category, description, imagePath, productId) {
  const newRow = `
    <tr data-product-id="${productId}">
      <td>
        <div class="product-image">
          <img alt="Product image for ${name}" height="50" width="50" src="${imagePath}" />
        </div>
      </td>
      <td>${name}</td>
      <td>
        <span class="category-badge">
          ${category}
        </span>
      </td>
      <td>${description}</td>
      <td>
        <i class="fas fa-trash delete-icon"></i>
      </td>
    </tr>
  `;
  featuredProductsTable.tBodies[0].insertAdjacentHTML("beforeend", newRow);
}

// Function to clear the form
function clearForm() {
  productName.value = "";
  category.value = "";
  description.value = "";
  fileInput.value = "";
  isFeaturedCheckbox.checked = false;
  fileNameSpan.textContent = "No file chosen";
}

// Add Expense
// Show the modal when the "Add Expense" button is clicked
document.getElementById('addExpenseButton').addEventListener('click', function() {
    document.getElementById('expenseModal').style.display = 'block';
});

// Close the modal when the close button is clicked
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('expenseModal').style.display = 'none';
});

// Add expense to the table when the "Add" button in the modal is clicked
document.getElementById('submitExpense').addEventListener('click', function() {
    const modalDate = document.getElementById('modalDate').value;
    const modalCategory = document.getElementById('modalCategory').value;
    const modalDescription = document.getElementById('modalDescription').value;
    const modalAmount = document.getElementById('modalAmount').value;

    // Create a new row for the table
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${modalDate}</td>
        < td>${modalCategory}</td>
        <td>${modalDescription}</td>
        <td>${modalAmount}</td>
        <td><button><i class="fas fa-edit"></i></button><button><i class="fas fa-trash-alt"></i></button></td>
    `;
    document.getElementById('expenseTableBody').appendChild(newRow);

    // Clear the modal fields
    document.getElementById('modalDate').value = '';
    document.getElementById('modalCategory').value = '';
    document.getElementById('modalDescription').value = '';
    document.getElementById('modalAmount').value = '';

    // Close the modal
    document.getElementById('expenseModal').style.display = 'none';
});
