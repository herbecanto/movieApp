const create = (element) => document.createElement(element);
const language = "es-MX";
let page = 1;
let currentFetchInfiniteScroll;

async function fetchData(params, extraParams = "") {
   const API = "https://api.themoviedb.org/3/";
   const API_KEY = "a6ab7a979a8d2f657c42b91b20a9b7ae";
   try {
      const response = await fetch(
         `${API}${params}?api_key=${API_KEY}&language=${language}${extraParams}&page=${page}`
      );

      if (response.status === 200) {
         const data = await response.json();
         //revisa que tenga datos válidos y que la key no sea id
         const isAValidData = data.results
            ? data.results.length > 0
            : Object.keys(data).filter((d) => d !== "id").length > 0;
         if (isAValidData) {
            console.log("data del fetch: ", data);
            return data.results || data;
         }
         if (language !== "en-US") {
            const responseEn = await fetch(
               `${API}${params}?api_key=${API_KEY}&language=en-US${extraParams}`
            );
            if (responseEn.status === 200) {
               const dataEn = await responseEn.json();
               return dataEn.results || dataEn;
            }
         }
      }
      return null;
   } catch (error) {
      console.log(error);
      return null;
   }
}

//Observadores
//lazy loader
const lazyLoader = new IntersectionObserver((entries) => {
   entries.forEach((entry) => {
      /* console.log({ entry }); */
      if (entry.isIntersecting) {
         const imgSrc = entry.target.getAttribute("data-img");
         entry.target.setAttribute("src", imgSrc);
      }
   });
});

//infinite scroll
function infiniteScrollObserver(callback) {
   return new IntersectionObserver(
      (entries, observer) => {
         const lastMovie = entries[0];
         if (!lastMovie.isIntersecting) return;
         observer.unobserve(lastMovie.target);
         page++;
         callback();
      },
      {
         rootMargin: "100px",
      }
   );
}

//función para hacer los posters
function createMovieContainer(
   movies,
   container,
   { lazyLoad = false, clean = true, infiniteScrollCallback = null } = {}
) {
   if (clean) {
      container.innerHTML = "";
   }

   movies.forEach((movie) => {
      const movieContainer = create("div");
      const movieImg = create("img");
      const titleContainer = create("div");
      const movieTitle = create("h4");
      const button = create("button");

      movieContainer.classList.add("movie-container");
      movieImg.setAttribute(
         lazyLoad ? "data-img" : "src",
         "https://image.tmdb.org/t/p/w300" + movie.poster_path
      );
      movieImg.setAttribute("alt", movie.title);
      movieImg.addEventListener("click", () => {
         location.hash = `movie=${movie.id}`;
      });
      movieTitle.innerHTML = movie.title;

      if (lazyLoad) {
         lazyLoader.observe(movieImg);
      }

      titleContainer.appendChild(movieTitle);
      movieContainer.appendChild(button);
      movieContainer.appendChild(movieImg);
      movieContainer.appendChild(titleContainer);

      container.appendChild(movieContainer);
   });
   if (typeof infiniteScrollCallback === "function") {
      const lastMovieContainer = container.querySelector(
         ".movie-container:last-child"
      );
      if (lastMovieContainer) {
         const observer = infiniteScrollObserver(infiniteScrollCallback);
         observer.observe(lastMovieContainer);
      }
   }
}

//función para hacer las tarjetas de cast
function createCastCard(cast, container, lazyLoad = false) {
   container.innerHTML = "";
   cast.forEach((actor) => {
      const cardContainer = create("div");
      const castImg = create("img");
      const actorInfo = create("div");
      const actorName = create("h4");
      const character = create("p");

      cardContainer.classList.add("cast__card");
      castImg.setAttribute(
         lazyLoad ? "data-img" : "src",
         "https://image.tmdb.org/t/p/w185/" + actor.profile_path
      );
      castImg.setAttribute("alt", actor.name);

      actorName.innerHTML = actor.name;
      character.innerHTML = actor.character;

      if (lazyLoad) {
         lazyLoader.observe(castImg);
      }

      actorInfo.appendChild(actorName);
      actorInfo.appendChild(character);

      cardContainer.appendChild(castImg);
      cardContainer.appendChild(actorInfo);
      container.appendChild(cardContainer);
   });
}

//función para la página de categoría
function createCategories(categories, container) {
   container.innerHTML = "";
   categories.forEach((category) => {
      const button = create("button");
      button.addEventListener("click", () => {
         location.hash = `category=${category.id}-${category.name}`;
      });
      button.innerHTML = category.name;
      container.appendChild(button);
   });
}

//función de formato de tiempo
function timeFormat(time) {
   let movieH = Math.floor(time / 60);
   let movieM = time % 60;
   return `${movieH}H ${movieM}m`;
}

//Función para el hero
async function createHero(id) {
   const movie = await fetchData(`movie/${id}`);
   /* const movieImg = await fetchData(`movie/${id}/images`); */
   console.log("pelicula", movie);
   console.log(
      "create hero ha sido llamado! la pelicula es:",
      movie.id + movie.title
   );

   heroPosterMobile.src = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
   heroPoster500.setAttribute(
      "srcset",
      "https://image.tmdb.org/t/p/w780" + movie.backdrop_path
   );
   heroPoster800.setAttribute(
      "srcset",
      "https://image.tmdb.org/t/p/w1280" + movie.backdrop_path
   );

   heroRating.innerHTML = movie.vote_average.toFixed(1);
   heroTime.innerHTML = timeFormat(movie.runtime);
   heroTitle.innerHTML = movie.title;
   heroDescription.innerHTML = movie.overview;
   heroDetailsBtn.addEventListener("click", () => {
      location.hash = `movie=${movie.id}`;
   });
   heroTrailerBtn.addEventListener("click", () => {
      heroTrailerContainer.classList.remove("hidden");
   });

   const trailerUrl = await getTrailer(id);
   heroTrailer.src = `https://www.youtube.com/embed/${trailerUrl}`;
}

//función para el video del tailer
async function getTrailer(id) {
   const videos = await fetchData(`movie/${id}/videos`);

   console.log("videos: ", videos);
   const trailers = videos.filter((video) => video.type === "Trailer");
   console.log("trailers: ", trailers);
   console.log("trailer_key: ", trailers[0].key);
   return trailers[0].key;
}

//funciones para solicitudes de la API según la página
async function getTrendingPreview() {
   const movies = await fetchData("trending/movie/day");
   console.log(movies);
   createMovieContainer(movies, trendingPreviewMovies, {
      lazyLoad: true,
      clean: false,
   });
   createHero(movies[0].id);
   /* try {
      const response = await fetch(
         `${API}trending/movie/day?api_key=${API_KEY}&language=es-MX`
      );
      console.log(response);

      if (response.status === 200) {
         const data = await response.json();
         const movies = data.results;
         console.log(movies);
         createHero(movies[0]);
         createMovieContainer(movies, trendingPreview);
      } else {
         console.log("Error en la petición");
      }
   } catch (error) {
      console.log(error);
   } */
}

async function getCategories(container) {
   const data = await fetchData("genre/movie/list");

   const genres = data.genres;
   console.log(genres);
   createCategories(genres, container);
}

async function getTrendingMovies() {
   const movies = await fetchData("trending/movie/day");
   console.log("trending movies, page: ", page, movies);
   createMovieContainer(movies, genericContainer, {
      lazyLoad: true,
      clean: page == 1,
      infiniteScrollCallback: () => {
         getTrendingMovies();
      },
   });
}
async function getMoviesByCategory(id) {
   const movies = await fetchData(`discover/movie`, `&with_genres=${id}`);
   console.log("categories page: ", page, movies);
   createMovieContainer(movies, genericContainer, {
      lazyLoad: true,
      clean: page == 1,
      infiniteScrollCallback: () => {
         getMoviesByCategory(id);
      },
   });
}

async function getMoviesByPopularity() {
   const movies = await fetchData("movie/popular");
   console.log("Popularity page: ", page, movies);
   createMovieContainer(movies, genericContainer, {
      lazyLoad: true,
      clean: page == 1,
      infiniteScrollCallback: () => {
         getMoviesByPopularity();
      },
   });
}

async function getMoviesByUpcoming() {
   const movies = await fetchData("movie/upcoming");
   console.log("Upcoming page: ", page, movies);
   createMovieContainer(movies, genericContainer, {
      lazyLoad: true,
      clean: page == 1,
      infiniteScrollCallback: () => {
         getMoviesByUpcoming();
      },
   });
}

async function getMoviesByQuery(query) {
   const movies = await fetchData(`search/movie`, `&query=${query}`);
   console.log("Query page: ", page, movies);
   createMovieContainer(movies, genericContainer, {
      lazyLoad: true,
      clean: page == 1,
      infiniteScrollCallback: () => {
         getMoviesByQuery(query);
      },
   });
}

async function getMovieById(id) {
   const movie = await fetchData(`movie/${id}`);
   movieDetailsPoster780.srcset =
      "https://image.tmdb.org/t/p/w780" + movie.poster_path;
   movieDetailsPoster500.src =
      "https://image.tmdb.org/t/p/w500" + movie.poster_path;
   movieDetailsTitle.innerHTML = movie.title;
   movieDetailsScore.innerHTML = movie.vote_average.toFixed(1);
   movieDetailsTime.innerHTML = timeFormat(movie.runtime);
   movieDetailsDescription.innerHTML = movie.overview;

   createCategories(movie.genres, movieDetailsCategories);

   const trailerUrl = await getTrailer(movie.id);
   movieDetailsVideo.src = `https://www.youtube.com/embed/${trailerUrl}`;
   console.log("trailer url: ", trailerUrl);

   const castData = await fetchData(`movie/${id}/credits`);
   console.log("cast!: ", castData);
   const cast = castData.cast.filter(
      (actor) =>
         actor.known_for_department === "Acting" &&
         actor.character !== "Additional Voices (voice)"
   );
   console.log("cast filtrado: ", cast);
   createCastCard(cast, castContainer, true);

   const similarMoviesData = await fetchData(`movie/${id}/similar`);

   createMovieContainer(similarMoviesData, similarSlider, {
      lazyLoad: true,
      clean: page == 1,
   });

   console.log(movie);
}
