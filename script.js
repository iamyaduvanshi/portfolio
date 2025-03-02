// Toggle Mobile Navigation
const hamburger = document.getElementById("hamburger");
const navUl = document.querySelector("#navMenu ul");

hamburger.addEventListener("click", () => {
  navUl.classList.toggle("active");
});
