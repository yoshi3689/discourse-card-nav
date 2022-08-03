import {
  apiInitializer
} from "discourse/lib/api";

export default apiInitializer("0.8", (api) => {
  api.onPageChange(() => {
    const categoryCardToggle = document.querySelector('.category-toggle');
    if (categoryCardToggle) {
      const hiddenCards = document.querySelectorAll(".card-hidden");
      categoryCardToggle.addEventListener("click", () => {
        categoryCardToggle.style.display = "none";
        hiddenCards.forEach(card => card.classList.remove('card-hidden'));
      }); 
    }
  });
});