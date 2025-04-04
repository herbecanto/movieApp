const query = (id) => document.querySelector(id);
const heroContainer = query("#hero-container");
const backButton = query(".backBtn");

/* navBar Buttons */
const headerButtons = document.querySelectorAll(".header__item a");

/* Trending Preview */
const trendingPreviewContainer = query("#trending-preview-container");
const trendingPreviewMovies = query("#trending-preview__movie-container");
const trendingPreviewBtn = query("#trending-preview-btn");

/* Categories */
const categoriesPreviewContainer = query("#categories-preview__container");
const categoriesButtonsContainer = query("#categories-buttons-container");

/* Generic */
const genericSection = query("#genericMovies-section");
const genericContainer = query("#genericMovies-container");
const genericTitle = query("#generic-title");
