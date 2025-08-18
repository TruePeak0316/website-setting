document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".seclect-button");
  const sections = document.querySelectorAll(".service-content");

  function showSectionById(id) {
    sections.forEach(section => {
      section.classList.remove("active");
    });
    const targetSection = document.getElementById(id);
    if (targetSection) {
      targetSection.classList.add("active");
    }
  }

  buttons.forEach(button => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").replace("#", "");
      showSectionById(targetId);
    });
  });

  // 根據網址 hash 顯示對應區塊
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    showSectionById(hash);
  } else {
    showSectionById("tax-service"); // 預設顯示
  }
});