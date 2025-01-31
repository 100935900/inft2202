import { movies } from "../data/movies.js";

console.log("Movie collection loaded successfully:", movies);

const allMoviesTable = document.querySelector("#all-movies-container table");
const pinnedMoviesTable = document.querySelector("#pinned-movies-container table");
const allMoviesAlert = document.querySelector("#all-movies-container .alert");
const pinnedMoviesAlert = document.querySelector("#pinned-movies-container .alert");

const fetchPinnedMovies = () => JSON.parse(localStorage.getItem("pinnedMovies")) || [];
const updatePinnedMovies = (pinnedMovies) => localStorage.setItem("pinnedMovies", JSON.stringify(pinnedMovies));

const createMovieRow = (movie, pinnedMovies) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${movie.title}</td>
        <td>${movie.genre}</td>
        <td>${new Date(movie.release_date * 1000).toLocaleDateString()}</td>
        <td>${movie.director}</td>
        <td>${movie.rating}</td>
        <td><button class="btn ${pinnedMovies.some(m => m.title === movie.title) ? "btn-danger" : "btn-primary"}">
            ${pinnedMovies.some(m => m.title === movie.title) ? '<i class="fas fa-times"></i>' : '<i class="fas fa-thumbtack"></i>'}
        </button></td>
    `;
    
    row.classList.add(
        movie.rating <= 2 ? "table-danger" :
        movie.rating <= 5 ? "table-warning" :
        movie.rating <= 8 ? "table-primary" : "table-success"
    );
    
    const button = row.querySelector("button");
    button.addEventListener("click", () => {
        const updatedMovies = pinnedMovies.some(m => m.title === movie.title)
            ? pinnedMovies.filter(m => m.title !== movie.title)
            : [...pinnedMovies, movie];
        updatePinnedMovies(updatedMovies);
        location.reload();
    });
    
    return row;
};

const renderMovieTable = (tableElement, movieList) => {
    const tbody = tableElement.querySelector("tbody");
    tbody.innerHTML = "";
    const pinnedMovies = fetchPinnedMovies();
    movieList.filter(movie => movie.genre !== "Drama")
        .sort((a, b) => b.rating - a.rating)
        .forEach(movie => tbody.appendChild(createMovieRow(movie, pinnedMovies)));
    
    tableElement.classList.remove("d-none");
};

const pinnedMovies = fetchPinnedMovies();
console.log("Pinned movies list:", pinnedMovies);

pinnedMoviesAlert.classList.toggle("d-none", pinnedMovies.length !== 0);
if (pinnedMovies.length) renderMovieTable(pinnedMoviesTable, pinnedMovies);

allMoviesAlert.classList.toggle("d-none", movies.length !== 0);
if (movies.length) renderMovieTable(allMoviesTable, movies);
