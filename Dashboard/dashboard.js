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

// Function to calculate the total of currency amounts in <td> elements with colspan="2"
function calculateTotal() {
  // Select all <td> elements with colspan="2"
  const amountCells = document.querySelectorAll('td[colspan="2"]');
  let total = 0;

  amountCells.forEach((cell) => {
    // Get the text content of the cell
    const cellText = cell.textContent.trim();

    // Check if the text contains a currency symbol (for example, "&#8373;" for currency)
    // and remove the currency symbol and any commas before converting to a float
    if (cellText.includes("&#8373;")) {
      const amount = parseFloat(
        cellText.replace("&#8373;", "").replace(",", "").trim()
      );
      if (!isNaN(amount)) {
        total += amount; // Add the amount to the total
      }
    }
  });

  // Display the total in the desired location
  const totalCell = document.querySelector("#total td:last-child strong");
  if (totalCell) {
    totalCell.textContent = `&#8373;${total.toFixed(2)}`; // Update the total cell with the new total
  }
}

// Call the function to calculate the total
calculateTotal();

// Invoice
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("invoiceModal");
  const btn = document.querySelector('[data-id="invoice"] .btn');
  const span = document.getElementById("closeModal");
  const invoiceTableBody = document
    .getElementById("invoiceTable")
    .querySelector("tbody");

  // Function to generate a unique invoice ID
  function generateInvoiceId() {
    const randomId = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
    return `INV-${randomId}`;
  }

  // Function to store invoices in local storage
  function storeInvoices(invoices) {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }

  // Function to load invoices from local storage
  function loadInvoices() {
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    invoices.forEach(addTableRow);
  }

  // Function to get invoices from local storage
  function getInvoices() {
    return JSON.parse(localStorage.getItem("invoices")) || [];
  }

  // Open the modal
  btn.onclick = function () {
    modal.style.display = "block";
    // Reset form and clear any previous edit state
    document.getElementById("invoiceForm").reset();
    document.getElementById("invoiceForm").removeAttribute("data-edit-id");
  };

  // Close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // Close when clicking outside
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  // Load existing invoices from local storage when the page loads
  loadInvoices();

  // Handle form submission for both create and edit
  document.getElementById("invoiceForm").onsubmit = function (event) {
    event.preventDefault();

    const customerName = document.getElementById("customer").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const paymentStatus = document.getElementById("paymentStatus").value;
    const orderStatus = document.getElementById("orderStatus").value;

    // Generate invoice_id if we're creating a new invoice
    const editId = this.getAttribute("data-edit-id");
    const isEditing = !!editId;
    const invoiceId = isEditing ? editId : generateInvoiceId(); // Use generated ID if not editing

    const invoiceData = {
      invoice_id: invoiceId,
      customer_name: customerName,
      amount: amount,
      payment_status: paymentStatus,
      order_status: orderStatus,
    };

    const url = isEditing ? `/api/invoices/${editId}` : "/api/invoices";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    })
      .then((response) => response.json())
      .then((data) => {
        let invoices = getInvoices();

        if (isEditing) {
          // Update existing row in local storage
          const index = invoices.findIndex(
            (invoice) => invoice.invoice_id === editId
          );
          invoices[index] = invoiceData;

          // Update existing row in the table
          const row = document.querySelector(`tr[data-invoice-id="${editId}"]`);
          updateTableRow(row, invoiceData);
        } else {
          // Add new row and store it in local storage
          invoices.push(invoiceData);
          addTableRow(invoiceData);
        }

        // Store updated invoices
        storeInvoices(invoices);

        // Clear form and close modal
        this.reset();
        this.removeAttribute("data-edit-id");
        modal.style.display = "none";

        alert(
          isEditing
            ? "Invoice updated successfully!"
            : "Invoice created successfully!"
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(
          "Failed to " +
            (isEditing ? "update" : "create") +
            " invoice. Please try again."
        );
      });
  };

  // Function to add a new row to the table
  function addTableRow(data) {
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-invoice-id", data.invoice_id);
    updateTableRow(newRow, data);
    invoiceTableBody.prepend(newRow);

    // Add event listeners for the new row
    addRowEventListeners(newRow);
  }

  // Function to update an existing row
  function updateTableRow(row, data) {
    row.innerHTML = `
    <td>${data.invoice_id}</td>
    <td>${data.customer_name}</td>
    <td>&#8373;${
      data.amount !== undefined ? data.amount.toFixed(2) : "0.00"
    }</td>
    <td>${data.payment_status}</td>
    <td>${data.order_status}</td>
    <td class="actions-1">
      <i class="fas fa-edit"></i>
      <i class="fas fa-trash"></i>
    </td>
  `;
  }

  // Function to add event listeners to a row
  function addRowEventListeners(row) {
    const editIcon = row.querySelector(".fa-edit");
    const deleteIcon = row.querySelector(".fa-trash");

    if (editIcon) {
      editIcon.addEventListener("click", () => {
        const invoiceId = row.getAttribute("data-invoice-id");
        editInvoice(invoiceId, row);
      });
    }

    if (deleteIcon) {
      deleteIcon.addEventListener("click", () => {
        const invoiceId = row.getAttribute("data-invoice-id");
        deleteInvoice(invoiceId, row);
      });
    }
  }

  // Function to edit an invoice
  function editInvoice(invoiceId, row) {
    // Populate form with current values
    document.getElementById("customer").value =
      row.querySelector("td:nth-child(2)").textContent;
    document.getElementById("amount").value = row
      .querySelector("td:nth-child(3)")
      .textContent.replace("₵", "");
    document.getElementById("paymentStatus").value =
      row.querySelector("td:nth-child(4)").textContent;
    document.getElementById("orderStatus").value =
      row.querySelector("td:nth-child(5)").textContent;

    // Set form to edit mode
    const form = document.getElementById("invoiceForm");
    form.setAttribute("data-edit-id", invoiceId);

    // Show modal
    modal.style.display = "block";
  }

  // Function to delete an invoice
  function deleteInvoice(invoiceId, row) {
    if (confirm("Are you sure you want to delete this invoice?")) {
      fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          row.remove(); // Remove the row from the table

          // Remove from local storage
          let invoices = getInvoices();
          invoices = invoices.filter(
            (invoice) => invoice.invoice_id !== invoiceId
          );
          storeInvoices(invoices);

          alert("Invoice deleted successfully!");
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to delete invoice. Please try again.");
        });
    }
  }

  // Add event listeners to existing rows
  document.querySelectorAll("#invoiceTable tbody tr").forEach((row) => {
    addRowEventListeners(row);
  });
});

// Add category pop up
document.addEventListener("DOMContentLoaded", () => {
  const popupMenu = document.getElementById("popupMenu");
  const addCategoryBtn = document.getElementById("addCategoryBtn");
  const closePopup = document.getElementById("closePopup");
  const submitBtn = document.getElementById("submitBtn");
  const categoryTable = document.getElementById("categoryTableBody");

  // Load categories from localStorage and populate the table
  function loadCategories() {
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    categoryTable.innerHTML = ""; // Clear the table

    categories.forEach((category) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${category.name}</td>
        <td>${category.lastUpdated}</td>
        <td class="actions">
          <i class="fas fa-edit" data-id="${category.id}"></i>
          <i class="fas fa-trash" data-id="${category.id}"></i>
        </td>
      `;
      categoryTable.prepend(newRow);

      // Add event listeners for edit and delete buttons
      newRow.querySelector(".fa-edit").addEventListener("click", editCategory);
      newRow
        .querySelector(".fa-trash")
        .addEventListener("click", deleteCategory);
    });
  }

  // Load existing categories on page load
  loadCategories();

  // Function to generate a unique category ID
  function generateCategoryId() {
    return "cat_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  }

  // Handle category submission
  submitBtn.onclick = async function () {
    const name = document.getElementById("name").value;
    const lastUpdated = document.getElementById("lastUpdated").value;

    if (!name || !lastUpdated) {
      alert("Please fill in all fields");
      return;
    }

    // Generate a unique category ID
    const categoryId = generateCategoryId();

    // Create the category object
    const newCategory = {
      id: categoryId,
      name: name,
      lastUpdated: lastUpdated,
    };

    // Store category data in localStorage
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    categories.push(newCategory);
    localStorage.setItem("categories", JSON.stringify(categories));

    // Update the table
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${name}</td>
      <td>${lastUpdated}</td>
      <td class="actions">
        <i class="fas fa-edit" data-id="${categoryId}"></i>
        <i class="fas fa-trash" data-id="${categoryId}"></i>
      </td>
    `;
    categoryTable.prepend(newRow);

    // Add event listeners for edit and delete buttons
    newRow.querySelector(".fa-edit").addEventListener("click", editCategory);
    newRow.querySelector(".fa-trash").addEventListener("click", deleteCategory);

    // Clear form and close popup
    document.getElementById("name").value = "";
    document.getElementById("lastUpdated").value = "";
    popupMenu.style.display = "none";

    alert("Category added successfully!");

    // Send the new category to the backend
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });
    } catch (error) {
      console.error("Error sending category to backend:", error);
    }
  };

  // Function to handle category editing
  async function editCategory(event) {
    const categoryId = event.target.getAttribute("data-id");
    const row = event.target.closest("tr");
    const name = row.querySelector("td:nth-child(1)").textContent;
    const lastUpdated = row.querySelector("td:nth-child(2)").textContent;

    // Prompt user to enter new values
    const newName = prompt("Enter new category name:", name);
    const newDate = prompt("Enter new last updated date:", lastUpdated);

    if (!newName || !newDate) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Update localStorage
      const categories = JSON.parse(localStorage.getItem("categories")) || [];
      const categoryIndex = categories.findIndex(
        (category) => category.id === categoryId
      );
      if (categoryIndex !== -1) {
        categories[categoryIndex].name = newName;
        categories[categoryIndex].lastUpdated = newDate;
        localStorage.setItem("categories", JSON.stringify(categories));
      }

      // Update table row
      row.querySelector("td:nth-child(1)").textContent = newName;
      row.querySelector("td:nth-child(2)").textContent = newDate;

      alert("Category updated successfully!");

      // Send update to the backend
      await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          lastUpdated: newDate,
        }),
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update category. Please try again.");
    }
  }

  // Function to handle category deletion
  async function deleteCategory(event) {
    const categoryId = event.target.getAttribute("data-id");
    const row = event.target.closest("tr");

    if (confirm("Are you sure you want to delete this category?")) {
      try {
        // Remove from localStorage
        const categories = JSON.parse(localStorage.getItem("categories")) || [];
        const updatedCategories = categories.filter(
          (category) => category.id !== categoryId
        );
        localStorage.setItem("categories", JSON.stringify(updatedCategories));

        // Remove table row
        row.remove();

        alert("Category deleted successfully!");

        // Send delete request to the backend
        await fetch(`/api/categories/${categoryId}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to delete category. Please try again.");
      }
    }
  }

  // Open popup
  addCategoryBtn.onclick = function () {
    popupMenu.style.display = "block";
  };

  // Close popup
  closePopup.onclick = function () {
    popupMenu.style.display = "none";
  };

  // Close popup when clicking outside
  window.onclick = function (event) {
    if (event.target === popupMenu) {
      popupMenu.style.display = "none";
    }
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

// Expense ID Generator
function generateExpenseId() {
  return 'EXP-' + Math.floor(100000 + Math.random() * 900000);
}

document.addEventListener("DOMContentLoaded", function() {
  const expenseModal = document.getElementById("expenseModal");
  const addExpenseButton = document.getElementById("addExpenseButton");
  const closeModal = document.getElementById("closeModal-1");
  const submitExpense = document.getElementById("submitExpense");
  const expenseTableBody = document.getElementById("expenseTable");

  // Open expense modal
  addExpenseButton.addEventListener("click", function() {
    expenseModal.style.display = "block";
  });

  // Close expense modal
  closeModal.addEventListener("click", function() {
    expenseModal.style.display = "none";
  });

  // Close modal when clicking outside
  window.onclick = function(event) {
    if (event.target === expenseModal) {
      expenseModal.style.display = "none";
    }
  };

  // Handle form submission
  submitExpense.addEventListener("click", function(e) {
    e.preventDefault();

    const expenseId = generateExpenseId();
    const date = document.getElementById("modalDate").value;
    const category = document.getElementById("modalCategory").value;
    const description = document.getElementById("modalDescription").value;
    const amount = document.getElementById("modalAmount").value;

    // Validate inputs
    if (!date || !category || !description || !amount) {
      alert("Please fill in all fields");
      return;
    }

    const expenseData = {
      expense_id: expenseId,
      expense_date: date,
      category: category,
      description: description,
      amount: parseFloat(amount),
    };

    // Send data to backend
    fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expenseData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error);
      }

      // Add new row to table
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${date}</td>
        <td>${category}</td>
        <td>${description}</td>
        <td>&#8373;${parseFloat(amount).toFixed(2)}</td>
        <td class="actions">
          <i class="fas fa-trash-alt" data-expense-id="${expenseId}"></i>
        </td>
      `;
      expenseTableBody.appendChild(newRow);

      // Clear form and close modal
      document.getElementById("modalDate").value = '';
      document.getElementById("modalCategory").value = '';
      document.getElementById("modalDescription").value = '';
      document.getElementById("modalAmount").value = '';
      expenseModal.style.display = "none";

      alert("Expense added successfully!");
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Failed to add expense. Please try again.");
    });
  });

  // Handle delete expense
  expenseTableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('fa-trash-alt')) {
      const expenseId = e.target.getAttribute('data-expense-id');
      if (confirm('Are you sure you want to delete this expense?')) {
        deleteExpense(expenseId, e.target.closest('tr'));
      }
    }
  });

  function deleteExpense(expenseId, row) {
    fetch(`/api/expenses/${expenseId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error);
      }
      row.remove();
      alert("Expense deleted successfully!");
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Failed to delete expense. Please try again.");
    });
  }
});



// Customers
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("customerModal");
  const addCustomerButton = document.querySelector(".customer-btn");
  const closeBtn = document.querySelector(".close");
  const form = document.getElementById("customerForm");
  const customerTableBody = document.querySelector(".c-container tbody");

  // Open modal when Add Customer button is clicked
  addCustomerButton.onclick = function () {
    modal.style.display = "block";
  };

  // Close modal when (x) is clicked
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  // Close modal when clicking outside of it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Function to generate a random customer ID
  function generateRandomId() {
    return "CUST-" + Math.random().toString(36).slice(2, 9).toUpperCase();
  }
  // Load customers from local storage and display them in the table
  function loadCustomers() {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    customers.forEach((customer) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td class="row-name">${customer.name}</td>
        <td class="row-telephone">${customer.telephone_number}</td>
        <td class="row-orders">${customer.total_orders}</td>
        <td class="row-spent">&#8373;${customer.amount_paid.toFixed(2)}</td>
      `;
      customerTableBody.appendChild(newRow);
    });
  }

  // Handle form submission
  form.onsubmit = function (e) {
    e.preventDefault();

    const id = generateRandomId(); // Generate a random customer ID
    const name = document.getElementById("customerName").value;
    const telephone = document.getElementById("customerTelephone").value;
    const orders = document.getElementById("customerOrders").value;
    const spent = document.getElementById("customerSpent").value;

    // Prepare data to send to the API
    const customerData = {
      customer_id: id,
      name: name,
      telephone_number: telephone,
      total_orders: parseInt(orders),
      amount_paid: parseFloat(spent),
    };

    // Send data to the API
    fetch("/api/customers/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Create new table row
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
        <td class="row-name">${data.name}</td>
        <td class="row-telephone">${data.telephone_number}</td>
        <td class="row-orders">${data.total_orders}</td>
        <td class="row-spent">&#8373;${data.amount_paid.toFixed(2)}</td>
      `;

        // Add new row to table
        customerTableBody.appendChild(newRow);

        // Update local storage
        const customers = JSON.parse(localStorage.getItem("customers")) || [];
        customers.push(customerData);
        localStorage.setItem("customers", JSON.stringify(customers));

        // Clear form and close modal
        form.reset();
        modal.style.display = "none";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Load existing customers when the page loads
  loadCustomers();
});

// Logout
document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.querySelector(".logout"); 
  const logoutModal = document.getElementById("logoutModal");
  const closeLogoutModal = document.getElementById("closeLogoutModal");
  const confirmLogout = document.getElementById("confirmLogout");
  const cancelLogout = document.getElementById("cancelLogout");

  // Show the logout modal when the logout button is clicked
  logoutButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default logout action
    logoutModal.style.display = "block"; // Show the modal
  });

  // Close the modal when the close button is clicked
  closeLogoutModal.addEventListener("click", function () {
    logoutModal.style.display = "none"; // Hide the modal
  });

  // Close the modal when the cancel button is clicked
  cancelLogout.addEventListener("click", function () {
    logoutModal.style.display = "none"; // Hide the modal
  });

  // Confirm logout and redirect to the logout page
  confirmLogout.addEventListener("click", function () {
    // Redirect to the logout URL or perform logout action
    window.location.href = "logout.html";
  });

  // Close the modal when clicking outside of the modal content
  window.addEventListener("click", function (event) {
    if (event.target === logoutModal) {
      logoutModal.style.display = "none"; // Hide the modal
    }
  });
});
