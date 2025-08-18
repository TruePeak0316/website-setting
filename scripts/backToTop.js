// Create the button element
const backToTopBtn = document.createElement("button");
backToTopBtn.id = "backToTop";
backToTopBtn.title = "回到頂部";
backToTopBtn.textContent = "TOP";
document.body.appendChild(backToTopBtn);

// Style the button
const style = document.createElement("style");
style.textContent = `
#backToTop {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background-color: #ffffff;
  color: #005daa;
  border: 2px solid #005daa;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  display: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}
#backToTop:hover {
  background-color: #005daa;
  color: #ffffff;
}
`;
document.head.appendChild(style);

// Show or hide the button based on scroll position
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

// Scroll to top when the button is clicked
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});