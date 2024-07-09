document.addEventListener("DOMContentLoaded", () => {
  const movieService = new MovieService(
    "http://www.omdbapi.com/?i=tt3896198&apikey=baa0e2c9"
  );
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const typeSelect = document.getElementById("type-select");
  const moviesContainer = document.getElementById("movies-container");
  const loadingIndicator = document.getElementById("loading");
  const moreButton = document.getElementById("more-btn");
  let currentPage = 1;
  let currentSearch = "";
  let currentType = "";

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    currentSearch = searchInput.value;
    currentType = typeSelect.value;
    currentPage = 1;
    moviesContainer.innerHTML = "";
    moreButton.style.display = "none";
    loadingIndicator.style.display = "block";

    try {
      const data = await movieService.search(
        currentSearch,
        currentType,
        currentPage
      );
      displayMovies(data.Search);
      loadingIndicator.style.display = "none";
      moreButton.style.display = data.totalResults > 10 ? "block" : "none";
    } catch (error) {
      loadingIndicator.style.display = "none";
      alert("Ошибка при поиске фильмов: " + error.message);
    }
  });

  moreButton.addEventListener("click", async () => {
    currentPage++;
    moreButton.style.display = "none";
    loadingIndicator.style.display = "block";

    try {
      const data = await movieService.search(
        currentSearch,
        currentType,
        currentPage
      );
      displayMovies(data.Search, true);
      loadingIndicator.style.display = "none";
      moreButton.style.display =
        data.totalResults > currentPage * 10 ? "block" : "none";
    } catch (error) {
      loadingIndicator.style.display = "none";
      alert("Ошибка при загрузке дополнительных фильмов: " + error.message);
    }
  });

  function displayMovies(movies, append = false) {
    if (!append) {
      moviesContainer.innerHTML = "";
    }
    movies.forEach((movie) => {
      const movieItem = document.createElement("div");
      movieItem.className = "movie-item";
      movieItem.innerHTML = `
                <div>
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                </div>
                <button class="details-btn" data-id="${movie.imdbID}">Details</button>
            `;
      moviesContainer.appendChild(movieItem);
    });

    document.querySelectorAll(".details-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const movieId = event.target.getAttribute("data-id");
        loadingIndicator.style.display = "block";
        try {
          const movie = await movieService.getMovie(movieId);
          loadingIndicator.style.display = "none";
          showModal(movie);
        } catch (error) {
          loadingIndicator.style.display = "none";
          alert("Ошибка при получении информации о фильме: " + error.message);
        }
      });
    });
  }

  function showModal(movie) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
            <div class="modal-content">
                <h2>${movie.Title}</h2>
                <p><strong>Year:</strong> ${movie.Year}</p>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Actors:</strong> ${movie.Actors}</p>
                <p><strong>Plot:</strong> ${movie.Plot}</p>
                <button class="close-btn">Close</button>
            </div>
        `;
    document.body.appendChild(modal);
    modal.style.display = "flex";

    modal.querySelector(".close-btn").addEventListener("click", () => {
      modal.remove();
    });
  }
});
