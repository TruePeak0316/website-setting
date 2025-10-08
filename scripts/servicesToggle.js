document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".seclect-button");
  const sections = document.querySelectorAll(".service-content");
  const wrapper = document.querySelector(".tab-content-wrapper");

  function showSectionById(id, skipTransition = false) {
    sections.forEach(section => {
      section.classList.remove("active");
      if (skipTransition) {
        section.style.transition = "none";
      } else {
        section.style.transition = "";
      }
    });

    const targetSection = document.getElementById(id);
    if (targetSection) {
      void targetSection.offsetWidth;
      targetSection.classList.add("active");

      if (wrapper) {
        wrapper.style.height = targetSection.scrollHeight + "px";
      }

      if (skipTransition) {
        setTimeout(() => {
          targetSection.style.transition = "";
        }, 10);
      }
    }
  }

  buttons.forEach(button => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").replace("#", "");
      showSectionById(targetId); // 使用動畫
    });
  });

  const hash = window.location.hash.replace("#", "");
  if (hash) {
    showSectionById(hash, true); // 初次載入不啟動動畫
  } else {
    showSectionById("tax-service", true);
  }

  window.addEventListener("load", () => {
    const activeSection = document.querySelector(".service-content.active");
    if (activeSection && wrapper) {
      wrapper.style.height = activeSection.scrollHeight + "px";
    }
  });
});
