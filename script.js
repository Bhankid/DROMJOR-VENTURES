
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


// Footer
  document.getElementById("year").innerHTML = new Date().getFullYear();