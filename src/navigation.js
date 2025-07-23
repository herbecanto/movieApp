//carga del navegador
window.addEventListener("hashchange", navigator, false);
window.addEventListener("DOMContentLoaded", navigator, false);

//guardar la categoria anterior
let lastCategoryVisited = "28-Action";

//funciones para los escuchadores de los botones
//[boton, hash,ispreventDefault?]
const clickActions = [
   [trendingPreviewBtn, "#trending"],
   [backButton, "#home"],
];

clickActions.forEach(([button, hash]) =>
   button.addEventListener("click", () => {
      location.hash = hash;
   })
);
categoriesButtonHeader.addEventListener("click", (e) => {
   e.preventDefault();
   location.hash = `category=${lastCategoryVisited}`;
});
searchButton.addEventListener("click", (e) => {
   e.preventDefault();
   location.hash = `search=${searchInput.value}`;
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

//función para preparar la sección genérica de las páginas
function prepareGenericSection(title, hashButton) {
   heroContainer.classList.add("hidden");
   trendingPreviewContainer.classList.add("hidden");
   categoriesPreviewContainer.classList.add("hidden");
   movieDetails.classList.add("hidden");

   genericSection.classList.remove("hidden");
   genericContainer.classList.remove("hidden");

   genericTitle.innerHTML = title;

   navButtonsSelected(hashButton);
}

//función para navegar
function navigator() {
   console.log("Hash actual:", location.hash);
   console.log("Última categoría visitada:", lastCategoryVisited);
   movieDetailsVideo.src = "";
   heroTrailer.src = "";
   heroTrailerContainer.classList.add("hidden");
   page = 1;

   if (!location.hash.startsWith("#category=")) {
      genericSlider.classList.add("hidden");
      categoriesButtonHeader
         .closest(".header__item")
         .classList.remove("header__item--selected");
   }
   if (location.hash.startsWith("#trending")) {
      trendingPage();
   } else if (location.hash.startsWith("#search=")) {
      searchPage();
   } else if (location.hash.startsWith("#category=")) {
      categoriesPage();
   } else if (location.hash.startsWith("#popular")) {
      popularPage();
   } else if (location.hash.startsWith("#upcoming")) {
      upcomingPage();
   } else if (location.hash.startsWith("#movie=")) {
      movieInfoPage();
   } else {
      homePage();
   }
   //pone el scroll hasta arriba
   document.body.scrollTop = 0;
   document.documentElement.scrollTop = 0;
}

//funciones para cada página
function homePage() {
   console.log("home");
   heroContainer.classList.remove("hidden");

   trendingPreviewContainer.classList.remove("hidden");
   categoriesPreviewContainer.classList.remove("hidden");

   genericSection.classList.add("hidden");
   movieDetails.classList.add("hidden");

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
   const [_, categoryData] = document.location.hash.split("=");
   const [categoryID, categoryTitle] = categoryData.split("-");
   console.log(categoryData);
   console.log(categoryTitle);
   console.log(categoryID);
   lastCategoryVisited = categoryData;
   prepareGenericSection(decodeURI(categoryTitle), "#category=");
   categoriesButtonHeader
      .closest(".header__item")
      .classList.add("header__item--selected");
   genericSlider.classList.remove("hidden");
   getCategories(genericSlider);
   getMoviesByCategory(categoryID);
}

function popularPage() {
   prepareGenericSection("Popular", "#popular");
   getMoviesByPopularity();
}
function upcomingPage() {
   prepareGenericSection("Upcoming", "#upcoming");
   getMoviesByUpcoming();
}

function searchPage() {
   const [_, query] = document.location.hash.split("=");
   prepareGenericSection('Resultados de "' + decodeURI(query) + '"');
   getMoviesByQuery(query);

   console.log("query: ", query);
}

function movieInfoPage() {
   const [_, movieId] = document.location.hash.split("=");
   prepareGenericSection("Details");
   genericContainer.classList.add("hidden");
   movieDetails.classList.remove("hidden");
   getMovieById(movieId);
}
