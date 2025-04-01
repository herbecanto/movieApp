const create = (element) => document.createElement(element);
const language = "es-MX";

async function fetchData(params) {
   const API = "https://api.themoviedb.org/3/";
   const API_KEY = "a6ab7a979a8d2f657c42b91b20a9b7ae";
   try {
      const response = await fetch(
         `${API}${params}?api_key=${API_KEY}&language=${language}`
      );

      if (response.status === 200) {
         const data = await response.json();

         return data.results || data;
      } else {
         console.log("Error en la petición");
      }
   } catch (error) {
      console.log(error);
   }
}

function createMovieContainer(movies, container) {
   container.innerHTML = "";
   movies.forEach((movie) => {
      const movieContainer = create("div");
      const img = create("img");
      const titleContainer = create("div");
      const movieTitle = create("h4");
      const button = create("button");

      movieContainer.classList.add("movie-container");
      img.src = "https://image.tmdb.org/t/p/w300" + movie.poster_path;
      img.setAttribute("alt", movie.title);
      movieTitle.innerHTML = movie.title;

      titleContainer.appendChild(movieTitle);
      movieContainer.appendChild(button);
      movieContainer.appendChild(img);
      movieContainer.appendChild(titleContainer);
      container.appendChild(movieContainer);
   });
}

function createCategories(categories, container) {
   categories.forEach((category) => {
      const button = create("button");
   });
}

async function createHero(id) {
   try {
      const movie = await fetchData(`movie/${id}`);
      /* const movieImg = await fetchData(`movie/${id}/images`); */
      console.log("pelicula", movie);
      let movieH = Math.floor(movie.runtime / 60);

      let movieM = movie.runtime % 60;
      /* while (movieTime > 60) {
         movieH++;
         movieTime - 60;
      } */
      console.log(movieH);
      console.log(movieM);

      heroContainer.innerHTML = `<div class="hero__poster">
               <picture class="hero__image">
                  <source
                     media="(min-width:500px)"
                     srcset="
                        https://image.tmdb.org/t/p/original/${
                           movie.backdrop_path
                        }
                     "
                  />
                  <img
                     src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
                     alt=""
                  />
               </picture>
            </div>

            <article class="hero__info-container">
               <div class="hero__header">
                  <span class="hero__rating">${movie.vote_average.toFixed(
                     1
                  )}</span>
                  <span class="hero__time">${movieH}H ${movieM}m</span>
                  <span class="hero__trending">TRENDING</span>
               </div>

               <div class="hero__info">
                  <h3 class="hero__title" id="hero-title">${movie.title}</h3>
                  <p>
                     ${movie.overview}
                  </p>
               </div>

               <div class="hero__buttons">
                  <button class="hero__trailer-btn">Play Trailer</button>
                  <button class="hero__details-btn">Details</button>
               </div>
            </article>`;
   } catch (error) {}
}

async function getTrendingPreview() {
   const movies = await fetchData("trending/movie/day");
   console.log(movies);
   createMovieContainer(movies, trendingPreview);
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

async function getCategories() {
   const data = await fetchData("genre/movie/list");

   const genres = data.genres;
   console.log(genres);
}
getTrendingPreview();
getCategories();
