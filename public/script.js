
document.getElementById("open-nav").addEventListener("click", function (event) {
  event.preventDefault();
  document.querySelector(".nav-toggle").classList.toggle("active");
});

document
  .getElementById("close-nav")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector(".nav-toggle").classList.toggle("active");
  });

document.addEventListener("click", function (event) {
  if (!event.target.closest(".nav-toggle, .nav-links")) {
    document.querySelector(".nav-toggle").classList.remove("active");
  }
});

document.getElementById("search-icon").addEventListener("click", function () {
  const searchBar = document.getElementById("search-bar");
  searchBar.classList.toggle("active"); 
  searchBar.focus(); 
});



let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const paginationItems = document.querySelectorAll(".pagination-item");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");

function showSlide() {
  slides.forEach((slide, index) => {
    slide.classList.remove("active");
    paginationItems[index].classList.remove("active");
  });
  slides[currentSlide].classList.add("active");
  paginationItems[currentSlide].classList.add("active");
  slides[currentSlide].style.opacity = 0;
  setTimeout(() => {
    slides[currentSlide].style.opacity = 1;
  }, 0);
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide();
}

prevButton.addEventListener("click", prevSlide);
nextButton.addEventListener("click", nextSlide);

setInterval(nextSlide, 5000);

showSlide();


// Add to Cart SideBar

// Get the cart icon, cart sidebar, and close icon elements
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeIcon = document.getElementById('close-icon');

// Add event listeners to the cart icon and close icon
cartIcon.addEventListener('click', () => {
  // Toggle the open class on the cart sidebar
  cartSidebar.classList.toggle('open');

  // Prevent body scrolling when the cart sidebar is open
  if (cartSidebar.classList.contains('open')) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
});

closeIcon.addEventListener('click', () => {
  // Remove the open class from the cart sidebar
  cartSidebar.classList.remove('open');
  document.body.classList.remove('no-scroll'); // Ensure scrolling is enabled
});

// Close sidebar on outside click
document.addEventListener('click', (event) => {
  const isClickInside = cartSidebar.contains(event.target) || cartIcon.contains(event.target);
  
  if (!isClickInside && cartSidebar.classList.contains('open')) {
    cartSidebar.classList.remove('open');
    document.body.classList.remove('no-scroll'); // Ensure scrolling is enabled
  }
});

// Get the cart items container element
const cartItemsContainer = document.querySelector('.cart-items');

// Get all "Add to cart" buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Get the cart notification span
const cartNotificationSpan = document.getElementById('count');

// Get the cart status paragraph
const cartStatus = document.querySelector('.cart-header p');

// Initialize the count
let count = 0;

// Toastr js
// Initialize an object to store cart items
let cartItems = {};

// Configure Toastr options
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "200",
  hideDuration: "400",
  timeOut: "1500",
  extendedTimeOut: "800",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "slideDown",
  hideMethod: "fadeOut",
  escapeHtml: false,
};

// Add an event listener to each button
// addToCartButtons.forEach((button) => {
//   button.addEventListener('click', () => {
//     // Get the product details from the clicked button's parent element
//     const product = button.parentNode;
//     const productId = product.dataset.productId;
//     const productName = product.querySelector("h2").textContent;
//     const productImage = product.querySelector("img").src;

//     if (cartItems[productId]) {
//       // If the item is already in the cart, increase its quantity
//       cartItems[productId].quantity++;
//       updateCartItemDisplay(productId);
//     } else {
//       // If it's a new item, add it to the cart
//       cartItems[productId] = {
//         name: productName,
//         image: productImage,
//         quantity: 1,
//       };
//       addNewCartItemToDisplay(productId);
//     }

    // Update the total count
    // updateTotalCount();

    // Update the cart status
    // updateCartStatus();

    // Save cart item to database
    // saveCartItemToDatabase(productId);

    // Show toast alert using Toastr with custom class for animation
//     toastr.success(
//       `
//       <div style="display: flex; align-items: center;">
//         <img src="${productImage}" alt="${productName}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px; border-radius: 50%;">
//         <span>${productName} has been added to your cart!</span>
//       </div>
//     `,
//       "Added to Cart",
//       {
//         className: "toast-success animated",
//       }
//     );
//   });
// });

// function updateCartItemDisplay(productId) {
//   const cartItemElement = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
//   if (cartItemElement) {
//     const quantityElement = cartItemElement.querySelector('.cart-item-quantity');
//     quantityElement.textContent = cartItems[productId].quantity;
//   }
// }

// function addNewCartItemToDisplay(productId) {
//   const productHTML = `
//     <div class="cart-item" data-product-id="${productId}">
//       <div class="cart-item-image-container">
//         <img src="${cartItems[productId].image}" alt="${cartItems[productId].name}">
//         <span class="cart-item-quantity">${cartItems[productId].quantity}</span>
//       </div>
//       <h2>${cartItems[productId].name}</h2>
//       <input type="number" class="cart-item-quantity-input" value="${cartItems[productId].quantity}" min="0" step="1">
//       <span class="remove-item">
//         <i class="fas fa-trash-alt"></i>
//       </span>
//     </div>
//   `;

//   const cartItem = document.createElement("div");
//   cartItem.innerHTML = productHTML;

//   // Add event listener to the recycle bin icon
//   cartItem.querySelector(".remove-item").addEventListener("click", () => {
//     // Remove the cart item
//     cartItemsContainer.removeChild(cartItem);
//     // Update the cart items count and total
//     updateCartItemsCountAndTotal();
//   });

//   cartItemsContainer.appendChild(cartItem);
// }

// function updateTotalCount() {
//   const totalCount = Object.values(cartItems).reduce((total, item) => total + item.quantity, 0);
//   cartNotificationSpan.textContent = totalCount;
// }

// function updateCartStatus() {
//   if (cartItemsContainer.children.length > 0) {
//     cartStatus.textContent = 'You have items in your cart';
//   } else {
//     cartStatus.textContent = 'Your cart is empty';
//   }
// }


// // Function to save cart item to database
// function saveCartItemToDatabase(productId) {
//   const item = cartItems[productId];
//   const amount = parseFloat(document.getElementById('amount').value) || 0;

//   const cartData = {
//     image: item.image,
//     name: item.name,
//     quantity: item.quantity,
//     amount: amount
//   };

//   fetch('/api/add-to-cart', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(cartData)
//   })
//   .then(response => response.json())
//   .then(data => {
//     if (data.error) {
//       toastr.error('Failed to save cart item');
//       console.error('Error:', data.error);
//     } else {
//       toastr.success('Cart item saved successfully');
//     }
//   })
//   .catch(error => {
//     toastr.error('Error saving cart item');
//     console.error('Error:', error);
//   });
// }

// Function to load cart items from database
// function loadCartItems() {
//   fetch('/api/cart-items')
//     .then(response => response.json())
//     .then(items => {
//       cartItemsContainer.innerHTML = ''; // Clear existing items
//       items.forEach(item => {
//         const productId = `db-${item.cart_id}`;
//         cartItems[productId] = {
//           name: item.name,
//           image: item.image,
//           quantity: item.quantity,
//           amount: item.amount
//         };
//         addNewCartItemToDisplay(productId);
//       });
//       updateTotalCount();
//       updateCartStatus();
//     })
//     .catch(error => {
//       console.error('Error loading cart items:', error);
//       toastr.error('Failed to load cart items');
//     });
// }

// document.addEventListener("DOMContentLoaded", function () {
//   fetch("/api/featured-products")
//     .then((response) => response.json())
//     .then((products) => {
//       const productsGrid = document.querySelector(".products-grid");

//       products.forEach((product) => {
//         if (product.is_featured || product.category === "CURRENT_CATEGORY") {
//           const productElement = createProductElement(product);
//           productsGrid.appendChild(productElement);
//         }
//       });
//     })
//     .catch((error) =>
//       console.error("Error fetching featured products:", error)
//     );
// });

// function createProductElement(product) {
//   const productElement = document.createElement("div");
//   productElement.className = "product";
//   productElement.setAttribute("data-product-id", product.id);

//   const productImage = document.createElement("img");
//   productImage.src = product.image;
//   productImage.alt = product.product_name;
//   productElement.appendChild(productImage);

//   const addToCartButton = document.createElement("button");
//   addToCartButton.className = "add-to-cart";
//   addToCartButton.textContent = "Add to cart";
//   productElement.appendChild(addToCartButton);

//   const productName = document.createElement("h2");
//   productName.className = "product-name";
//   productName.textContent = product.product_name;
//   productElement.appendChild(productName);

//   return productElement;
// }


// Footer
 


document.getElementById("year").innerHTML = new Date().getFullYear();