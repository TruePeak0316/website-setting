if (window.innerWidth > 768) {
  const container = document.querySelector('.guide-container');
  if (container) {
    container.innerHTML += container.innerHTML;
    let scrollLeft = container.scrollLeft;
    let isUserScrolling = false;
    let isDraggingScrollbar = true;
    let userScrollTimeout;

    container.addEventListener('scroll', () => {
      if (!isDraggingScrollbar) {
        pauseAutoScrollWithDelay();
      }
    });

    container.addEventListener('mousedown', (e) => {
      if (e.offsetY > container.clientHeight) {
        isDraggingScrollbar = true;
        isUserScrolling = true;
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDraggingScrollbar) {
        isDraggingScrollbar = true;
        scrollLeft = container.scrollLeft;
        isUserScrolling = false;
      }
    });

    function pauseAutoScrollWithDelay() {
      isUserScrolling = true;
      clearTimeout(userScrollTimeout);
      userScrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 1000);
    }

    function autoScroll() {
      if (isUserScrolling) return;
      scrollLeft += 1;
      container.scrollLeft = scrollLeft;
      if (scrollLeft >= container.scrollWidth / 2) {
        scrollLeft = container.scrollLeft - (container.scrollWidth / 2);
      }
    }

    setInterval(autoScroll, 30);
  }
}