import {
  apiInitializer
} from "discourse/lib/api";

export default apiInitializer("0.8", (api) => {
  api.onPageChange(() => {
    const categoryCardToggle = document.querySelector('.category-toggle');
    // if you are on the categories page
    if (categoryCardToggle) {
      // set an event listener for hiding cards after the 8th one
      const hiddenCards = document.querySelectorAll(".card-hidden");
      categoryCardToggle.addEventListener("click", () => {
        categoryCardToggle.style.display = "none";
        hiddenCards.forEach(card => card.classList.remove('card-hidden'));
      }); 
    }
  });
});