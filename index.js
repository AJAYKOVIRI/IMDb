
(function () {
  const ajayKeyword = document.getElementById("search");
  const ajayContainer = document.getElementById("card-container");
  const markMoviesContainer = document.getElementById("markMovieContainer");
  const emptyText = document.getElementById("empty-search-text");
  const showFav = document.getElementById("markSection");
  const emptyFavText = document.getElementById("empty-fav-text");

  addToFavDOM();
  showEmptyText();
  let suggestionList = [];
  let favMovieArray = [];

  ajayKeyword.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
    }
  });

  function showEmptyText() {
    if (markMoviesContainer.innerHTML == "") {
      emptyFavText.style.display = "block";
    } else {
      emptyFavText.style.display = "none";
    }
  }

  // Event listner on search
  ajayKeyword.addEventListener("keyup", function () {
    let search = ajayKeyword.value;
    if (search === "") {
      emptyText.style.display = "block";
      ajayContainer.innerHTML = "";
      suggestionList = [];
    } else {
      emptyText.style.display = "none";
      (async () => {
        let data = await fetchMovies(search);
        addToSuggestionContainerDOM(data);
      })();

      ajayContainer.style.display = "grid";
    }
  });

  // Fetches data from api and calls function to add it in
  async function fetchMovies(search) {
    const url = `https://www.omdbapi.com/?t=${search}&apikey=28a2ff0`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  // Shows in suggestion container DOM
  function addToSuggestionContainerDOM(data) {
    document.getElementById("empty-fav-text").style.display = "none";
    let isPresent = false;

    // to check if the movie is already present in the suggestionList array
    suggestionList.forEach((movie) => {
      if (movie.Title == data.Title) {
        isPresent = true;
      }
    });

    if (!isPresent && data.Title != undefined) {
      if (data.Poster == "N/A") {
        data.Poster = "";
      }
      suggestionList.push(data);
      const movieCard = document.createElement("div");
      movieCard.setAttribute("class", "text-decoration");

      movieCard.innerHTML = `
        <div class="card my-2" data-id = " ${data.Title} ">
        <a href="movie.html" >
          <img
            src="${data.Poster} "
            class="card-img-top"
            alt="..."
            data-id = "${data.Title} "
          />
          <div class="card-body text-start">
            <h5 class="card-title" >
              <a href="movie.html" data-id = "${data.Title} "> ${data.Title}  </a>
            </h5>
            <p class="card-text">
              <i class="fa-solid fa-star">
                <span id="rating">&nbsp;${data.imdbRating}</span>
              </i>
              <button class="fav-btn">
                <i class="fa-solid fa-heart add-fav" data-id="${data.Title}"></i>
              </button>
            </p>
          </div>
        </a>
      </div>
    `;
      ajayContainer.prepend(movieCard);
    }
  }

  // Add to favourite of localStorage
  async function handleFavBtn(e) {
    const target = e.target;

    let data = await fetchMovies(target.dataset.id);

    let favMoviesLocal = localStorage.getItem("favMoviesList");

    if (favMoviesLocal) {
      favMovieArray = Array.from(JSON.parse(favMoviesLocal));
    } else {
      localStorage.setItem("favMoviesList", JSON.stringify(data));
    }

    // to check if movie is already present in the fav list
    let isPresent = false;
    favMovieArray.forEach((movie) => {
      if (data.Title == movie.Title) {
        notify("already added to fav list");
        isPresent = true;
      }
    });

    if (!isPresent) {
      favMovieArray.push(data);
    }

    localStorage.setItem("favMoviesList", JSON.stringify(favMovieArray));
    isPresent = !isPresent;
    addToFavDOM();
  }

  // Add to favourite list DOM
  function addToFavDOM() {
    markMoviesContainer.innerHTML = "";

    let favList = JSON.parse(localStorage.getItem("favMoviesList"));
    if (favList) {
      favList.forEach((movie) => {
        const div = document.createElement("div");
        div.classList.add(
          "fav-movie-card",
          "d-flex",
          "justify-content-between",
          "align-content-center",
          "my-2"
        );
        div.innerHTML = `
   
    <img
      src="${movie.Poster}"
      alt=""
      class="fav-movie-poster"
    />
    <div class="movie-card-details">
      <p class="movie-name mt-3 mb-0">
       <a href = "movie.html" class="fav-movie-name" data-id="${movie.Title}">${movie.Title}<a> 
      </p>
      <small class="text-muted">${movie.Year}</small>
    </div>
    <div class="delete-btn my-4">
        <i class="fa-solid fa-trash-can" data-id="${movie.Title}"></i>
    </div>
    `;

        markMoviesContainer.prepend(div);
      });
    }
  }

  // To notify
  function notify(text) {
    window.alert(text);
  }

  // Delete from favourite list
  function deleteMovie(name) {
    let favList = JSON.parse(localStorage.getItem("favMoviesList"));
    let updatedList = Array.from(favList).filter((movie) => {
      return movie.Title != name;
    });

    localStorage.setItem("favMoviesList", JSON.stringify(updatedList));

    addToFavDOM();
    showEmptyText();
  }

  // Handles click events
  async function handleClickListner(e) {
    const target = e.target;

    if (target.classList.contains("add-fav")) {
      e.preventDefault();
      handleFavBtn(e);
    } else if (target.classList.contains("fa-trash-can")) {
      deleteMovie(target.dataset.id);
    } else if (target.classList.contains("fa-bars")) {
      if (showFav.style.display == "flex") {
        document.getElementById("ShowFav").style.color = "#8b9595";
        showFav.style.display = "none";
      } else {
        showFav.classList.add("");
        document.getElementById("ShowFav").style.color =
          "var(--logo-color)";
        showFav.style.display = "flex";
      }
    }

    localStorage.setItem("movieName", target.dataset.id);
  }

  // Event listner on whole document
  document.addEventListener("click", handleClickListner);
})();