
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


// Get the cart icon, cart sidebar, and close icon elements
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeIcon = document.getElementById('close-icon');

// Add event listeners to the cart icon and close icon
cartIcon.addEventListener('click', () => {
  // Toggle the open class on the cart sidebar
  cartSidebar.classList.toggle('open');
});

closeIcon.addEventListener('click', () => {
  // Remove the open class from the cart sidebar
  cartSidebar.classList.remove('open');
});


// Get all "Add to cart" buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Get the cart notification span
const cartNotificationSpan = document.getElementById('count');

// Initialize the count
let count = 0;

// Add an event listener to each button
addToCartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Increment the count
    count++;

    // Update the cart notification span with the new count
    cartNotificationSpan.textContent = count;
  });
});

// Footer
  document.getElementById("year").innerHTML = new Date().getFullYear();