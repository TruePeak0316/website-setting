function initializeNavbar() {
  const navbar = document.querySelector(".navbar");

  if (!navbar || navbar.dataset.initialized === "true") {
    return;
  }

  navbar.dataset.initialized = "true";
  const nav = navbar.querySelector("nav");
  const phoneHeading = navbar.querySelector(".logo h3");
  const phoneText = phoneHeading && phoneHeading.textContent
    ? phoneHeading.textContent.trim()
    : "";
  const menuToggle = document.createElement("button");
  menuToggle.className = "mobile-menu-toggle";
  menuToggle.type = "button";
  menuToggle.setAttribute("aria-label", "開啟主選單");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.innerHTML = "<span></span><span></span><span></span>";

  if (nav) {
    if (phoneText && !nav.querySelector(".mobile-nav-phone")) {
      const phoneLink = document.createElement("a");
      phoneLink.className = "mobile-nav-phone";
      phoneLink.href = "tel:0286720074";
      phoneLink.textContent = phoneText;
      nav.appendChild(phoneLink);
    }

    navbar.insertBefore(menuToggle, nav);

    menuToggle.addEventListener("click", () => {
      const isOpen = navbar.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "關閉主選單" : "開啟主選單");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navbar.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "開啟主選單");
      });
    });
  }
}

function initializeBackToTop() {
  if (document.getElementById("backToTop")) {
    return;
  }

  // Create the button element
  const backToTopBtn = document.createElement("button");
  backToTopBtn.id = "backToTop";
  backToTopBtn.title = "回到頂部";
  backToTopBtn.textContent = "TOP";
  document.body.appendChild(backToTopBtn);

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
}

function initializeCommonUi() {
  initializeNavbar();
  initializeBackToTop();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCommonUi);
} else {
  initializeCommonUi();
}

document.addEventListener("partials:loaded", initializeCommonUi);
