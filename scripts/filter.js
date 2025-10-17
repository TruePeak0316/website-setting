document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".article-card");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      // 先讓所有卡片執行離場動畫
      cards.forEach((card) => {
        card.classList.remove("card-enter", "card-enter-active");
        card.classList.add("card-exit");
      });

      // 等待離場動畫結束後再切換顯示
      setTimeout(() => {
        cards.forEach((card) => {
          const category = card.getAttribute("data-category");
          const match = filter === "全部" || category === filter;

          if (match) {
            card.style.display = "";
            card.classList.remove("card-exit");
            card.classList.add("card-enter");

            // 強制觸發 reflow 以啟動 transition
            void card.offsetWidth;
            card.classList.add("card-enter-active");
          } else {
            card.style.display = "none";
          }
        });
      }, 300); // 離場動畫時間

      // 更新按鈕樣式
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});