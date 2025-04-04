window.addEventListener("hashchange", navigator, false);
window.addEventListener("DOMContentLoaded", navigator, false);

const clickActions = [
   [trendingPreviewBtn, "#trending"],
   [backButton, "#home"],
];
clickActions.forEach(([button, hash]) =>
   button.addEventListener("click", () => (location.hash = hash))
);
/* backButton.addEventListener("click", () => {
   location.hash = "#home";
});
trendingPreviewBtn.addEventListener("click", () => {
   location.hash = "#trending";
}); */

//función para seleccionar la opción en el navbar
function navButtonsSelected(hash) {
   headerButtons.forEach((btn) => {
      if (btn.getAttribute("href") === hash) {
         btn.closest(".header__item").classList.add("header__item--selected");
      } else {
         btn.closest(".header__item").classList.remove(
            "header__item--selected"
         );
      }
   });
}

function navigator() {
   if (location.hash.startsWith("#trending")) {
      trendingPage();
   } else if (location.hash.startsWith("#search=")) {
      searchPage();
   } else if (location.hash.startsWith("#category=")) {
      categoriesPage();
   } else if (location.hash.startsWith("#movie=")) {
      movieInfoPage();
   } else {
      homePage();
   }
}

//pone el scroll hasta arriba
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;
function homePage() {
   console.log("home");
   heroContainer.classList.remove("hidden");
   trendingPreviewContainer.classList.remove("hidden");
   categoriesPreviewContainer.classList.remove("hidden");

   genericSection.classList.add("hidden");

   navButtonsSelected("#home");

   getTrendingPreview();
   getCategories();
}
function trendingPage() {
   heroContainer.classList.add("hidden");
   trendingPreviewContainer.classList.add("hidden");
   categoriesPreviewContainer.classList.add("hidden");
   genericSection.classList.remove("hidden");

   genericTitle.innerHTML = "Tendencias";

   navButtonsSelected("#trending");
   getTrendingMovies();
   console.log(backButton);
}
