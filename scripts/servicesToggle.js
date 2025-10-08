
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".seclect-button");
  const sections = document.querySelectorAll(".service-content");
  const wrapper = document.querySelector(".tab-content-wrapper");

  function showSectionById(id) {
    sections.forEach(section => {
      section.classList.remove("active");
    });
    const targetSection = document.getElementById(id);
    if (targetSection) {
      void targetSection.offsetWidth; // 強制重繪以啟動 transition（可選）
      targetSection.classList.add("active");

      // 調整父容器高度
      if (wrapper) {
        wrapper.style.height = targetSection.scrollHeight + "px";
      }
    }
  }

  buttons.forEach(button => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").replace("#", "");
      showSectionById(targetId);
    });
  });

  const hash = window.location.hash.replace("#", "");
  if (hash) {
    showSectionById(hash);
  } else {
    showSectionById("tax-service");
  }

  // 初始載入時也調整高度
  window.addEventListener("load", () => {
    const activeSection = document.querySelector(".service-content.active");
    if (activeSection && wrapper) {
      wrapper.style.height = activeSection.scrollHeight + "px";
    }
  });
});
