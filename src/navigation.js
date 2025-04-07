window.addEventListener("hashchange", navigator, false);
window.addEventListener("DOMContentLoaded", navigator, false);

let lastCategoryVisited = "28-Action";

const clickActions = [
   [trendingPreviewBtn, "#trending"],
   [backButton, "#home"],
];
clickActions.forEach(([button, hash]) =>
   button.addEventListener("click", () => (location.hash = hash))
);
categoriesButtonHeader.addEventListener("click", (e) => {
   e.preventDefault();
   location.hash = `category=${lastCategoryVisited}`;
});

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

function prepareGenericSection(title, hashButton) {
   heroContainer.classList.add("hidden");
   trendingPreviewContainer.classList.add("hidden");
   categoriesPreviewContainer.classList.add("hidden");
   genericSection.classList.remove("hidden");

   genericTitle.innerHTML = title;

   navButtonsSelected(hashButton);
}
function navigator() {
   console.log("Hash actual:", location.hash);
   console.log("Última categoría visitada:", lastCategoryVisited);
   if (!location.hash.startsWith("#category=")) {
      genericSlider.classList.add("hidden");
      categoriesButtonHeader.classList.remove("header__item--selected");
   }
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
   //pone el scroll hasta arriba
   document.body.scrollTop = 0;
   document.documentElement.scrollTop = 0;
}

function homePage() {
   console.log("home");
   heroContainer.classList.remove("hidden");
   trendingPreviewContainer.classList.remove("hidden");
   categoriesPreviewContainer.classList.remove("hidden");

   genericSection.classList.add("hidden");

   navButtonsSelected("#home");

   getTrendingPreview();
   getCategories(categoriesButtonsContainer);
}
function trendingPage() {
   prepareGenericSection("Tendencias", "#trending");
   getTrendingMovies();
   console.log(backButton);
}

function categoriesPage() {
   categoriesButtonHeader.classList.add("header__item--selected");
   const [_, categoryData] = document.location.hash.split("=");
   const [categoryID, categoryTitle] = categoryData.split("-");
   console.log(categoryData);
   console.log(categoryTitle);
   console.log(categoryID);
   lastCategoryVisited = categoryData;
   prepareGenericSection(decodeURI(categoryTitle), "#category=");
   genericSlider.classList.remove("hidden");
   getCategories(genericSlider);
   getMoviesByCategory(categoryID);
}
