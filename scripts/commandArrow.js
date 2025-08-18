
const track = document.querySelector('.carousel-track');
const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');
const card = document.querySelector('.article-card');
const gap = 16;

function getScrollStep() {
  const cardWidth = card.offsetWidth;
  const visibleCards = Math.floor(track.clientWidth / (cardWidth + gap));
  return (cardWidth + gap) * visibleCards;
}

let scrollAmount = 0;

leftArrow.addEventListener('click', () => {
  if (scrollAmount === 0) {
    // 已在最左邊，跳到最右邊
    scrollAmount = track.scrollWidth - track.clientWidth;
  } else {
    scrollAmount = Math.max(scrollAmount - getScrollStep(), 0);
  }
  track.scrollTo({ left: scrollAmount, behavior: 'smooth' });
});

rightArrow.addEventListener('click', () => {
  const maxScroll = track.scrollWidth - track.clientWidth;
  if (scrollAmount >= maxScroll) {
    // 已在最右邊，跳到最左邊
    scrollAmount = 0;
  } else {
    scrollAmount = Math.min(scrollAmount + getScrollStep(), maxScroll);
  }
  track.scrollTo({ left: scrollAmount, behavior: 'smooth' });
});