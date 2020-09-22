// constants
const movies_search = document.getElementById("movies-search");
const search_results = document.getElementById("search-results");
const search_dropdown = document.getElementById("search-dropdown");
const alert_box = document.getElementById("search_alert");
// const apiKey = "553cc726";
const apiKey = "eba6955a2c5a4dace95fa4773c9bf2bc";
// var api = "http://www.omdbapi.com/?apikey=" + apiKey + "&";
var api = "https://api.themoviedb.org/3/movie/";
const home_spinner = document.getElementById("home-loading-spinner");
const search_spinner = document.getElementById("search-loading-spinner");

const imdb_id = document.getElementById("search-param-id");
const year_id = document.getElementById("search-param-year");
const type_id = document.getElementById("search-param-type");
var clicks = 0;

const movie_genres = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War/Millitary",
    37: "Western"
};

// event listeners
window.addEventListener("load", () => {
    console.log(localStorage.getItem("showed_install_alert"));
    show_search_spinner("on");
    getPopularMovies();
    if (localStorage.getItem("showed_install_alert") != "yes") {
        setTimeout(() => {
            document.getElementById("install-alert").style.display = "block";
            localStorage.setItem("showed_install_alert", "yes");
            console.log("install alert should be loading...");
            setTimeout(() => {
                document.getElementById("install-alert").style.opacity = "0";
                setTimeout(() => {
                    document.getElementById("install-alert").style.display = "none";
                }, 2000);
            }, 12000);
        }, 20000);
    }
});
movies_search.addEventListener("submit", (event) => {
    event.preventDefault();
    return false;
});
movies_search.addEventListener("keyup", event => {
    if (event.keyCode == 13) {
        event.preventDefault();
        loadSearchMovies();
    }
});


// functions   
function show_search_spinner(action) {
    if (action == "on") {
        search_spinner.style.display = "block";
    } else {
        search_spinner.style.display = "none";
    }
}

function dropSearch() {
    var caller = document.getElementById("search-eye");
    if (search_dropdown.style.display == "none") {
        search_dropdown.style.display = "block";
        caller.classList.remove("fa-eye");
        caller.classList.add("fa-eye-slash");
    } else {
        search_dropdown.style.display = "none";
        caller.classList.remove("fa-eye-slash");
        caller.classList.add("fa-eye");
    }
}
function loadSearchMovies() {
    console.log(clicks);
    show_search_spinner("on");
    if (clicks == 0) {
        clicks++;
        setTimeout(() => {
            loadSearchMovies();
            return;
        }, 1000);
    } else if (clicks == 1) {
        clicks = 0;
    }
    
    if  (movies_search.value != "") {
        // api += "&t=" + movies_search.value;
        api = "https://api.themoviedb.org/3/search/movie?callback=JSONP_CALLBACK&query=" + movies_search.value + "&sort_by=popularity.desc&api_key=" + apiKey;
    }
    
    var xhr = new XMLHttpRequest();
    if ((imdb_id.value != null) && (imdb_id.value != undefined) && (imdb_id.value != "")) {
        api += "&i=" + imdb_id.value;
    }
    if ((year_id.value != null) && (year_id.value != undefined) && (year_id.value != "")) {
        api += "&y=" + year_id.value;
    }
    if (type_id.value != "none") {
        api += "&type=" + type_id.value;
    }
    console.log(api);
    
    xhr.onload = () => {
        var res = xhr.responseText;
        consumeMovieApi(res, "SEARCH RESULTS");
    }

    xhr.onerror = (error) => {
        console.log(xhr.statusText);
        createAlert("Unable to load search results. <br /> Check your internet connection.");
    }
    xhr.open("get", api);

    xhr.send();
}

function displayResults(r_title, r_year, r_plot, r_poster, r_genre, index, r_rating, r_runtime, r_actors) {
    var parent = document.createElement("div");
    parent.classList.add("movies-result", "col-12", "col-md-5");
    console.log("Created parent");

    var poster = document.createElement("img");
    poster.setAttribute("src", r_poster);
    parent.appendChild(poster);

    var info = document.createElement("div");
    info.classList.add("information");
    construct_results_information(info, "results-title", r_title, "Title");
    construct_results_information(info, "results-year", r_year, "Year");
    // construct_results_information(info, "results-runtime", r_runtime, "Runtime");
    construct_results_information(info, "results-genre", r_genre, "Genres");
    construct_results_information(info, "result-plot", r_plot, "Plot");
    // construct_results_information(info, "results-actors", r_actors, "Actors");

    search_results.prepend(parent);

    home_spinner.style.display = "block";
    parent.appendChild(info);
    if (movies_search.value != "") {
        var view_more_button = document.createElement("a");
        view_more_button.setAttribute("onclick", `loadMoreInfo(${index})`);
        view_more_button.innerText = "View more...";
        view_more_button.classList.add("view_more");
        parent.appendChild(view_more_button);
    }

    api = "https://api.themoviedb.org/3/movie/";
}
function construct_results_information(info, span_class, span_value, span_tag) {
    var span = document.createElement("span");
    span.classList.add(span_class);
    span.innerHTML = "<a class='text-danger'>" + `${span_tag}:` + "</a>" +  `${span_value}`;
    temp = document.createElement("div");
    temp.appendChild(span);
    info.appendChild(temp);
}

// popular movies function 
function getPopularMovies() {
    var popular_movies_api = "https://api.themoviedb.org/3/discover/movie?callback=JSONP_CALLBACK&sort_by=popularity.desc&api_key=" + apiKey;
    popular_xhr = new XMLHttpRequest();
    popular_xhr.onload = () => {
        res = popular_xhr.responseText; 
        consumeMovieApi(res, "POPULAR RIGHT NOW");
    }
    popular_xhr.onerror = () => {

    }
    popular_xhr.open("get", popular_movies_api);
    popular_xhr.send();
}

// search functions 
function consumeMovieApi(res, alert_msg) {
    show_search_spinner("off");
    res = JSON.parse(res.slice(15, res.length - 1));
    if (res.total_results != 0) {
        var results = res.results;
        clear_results();
        for (var i = 0; i < results.length; i++) {
            var r_title = results[i].title;
            var r_date = results[i].release_date;
            var r_plot = results[i].overview;
            var r_poster = "http://image.tmdb.org/t/p/w500/" + results[i].poster_path;
            var genre_ids = results[i].genre_ids;
            var genres = "";
            genre_ids.forEach(id => {
                genres += movie_genres[id] + ", ";
            });
            genres = genres.slice(0, genres.length - 2);
            var index = i;

            createAlert(alert_msg);
            displayResults(r_title, r_date, r_plot, r_poster, genres, index);
        }
    } else {
        createAlert("No results found :(| ");
        displayResults("No results found for that search string.", "", "", "", "");
    }
}
// create alert function 
function createAlert(msg) {
    document.getElementById("search_alert").innerHTML = msg;
    document.getElementById("search_alert").style.display = "block";
    console.log("createAlert is working");
}

function loadMoreInfo(index) {
    var xhr = new XMLHttpRequest();
    moreApi = "https://api.themoviedb.org/3/search/movie?callback=JSONP_CALLBACK&query=" + movies_search.value + "&sort_by=popularity.desc&api_key=" + apiKey;
    xhr.onload = () => {
        var res = xhr.responseText;
        console.log(res);
        res = JSON.parse(res.slice(15, res.length - 1));
        console.log(res);
        if (res.total_results != 0) {
            var results = res.results;
            var r_title = results[index].title;
            var r_date = results[index].release_date;
            var r_plot = results[index].overview;
            var r_poster = "http://image.tmdb.org/t/p/w500/" + results[index].poster_path;
            var genre_ids = results[index].genre_ids;
            var genres = "";
            genre_ids.forEach(id => {
                genres += movie_genres[id] + ", ";
            });
            genres = genres.slice(0, genres.length - 2);
            var r_rating = results[index].vote_average;

            // createAlert(alert_msg);
            moreResults(r_title, r_date, r_plot, r_poster, genres, r_rating);
        } else {
            createAlert("No results found :(| ");
            moreResults("No results found for that search string.", "", "", "", "");
        }
    }

    xhr.onerror = (error) => {
        console.log(xhr.statusText);
        createAlert("Unable to load search results. <br /> Check your internet connection.");
    }
    xhr.open("get", moreApi);

    xhr.send();   
}
function moreResults(r_title, r_date, r_plot, r_poster, r_genres, r_rating, index) {
    var movies_info_area = document.getElementById("movies_info_area");
    var movies_info_content = document.getElementById("movies_info_content");
    var home = document.getElementById("top");

    var parent = document.createElement("div");
    parent.classList.add("movies-result", "col-12", "col-md-5");
    console.log("Created parent");

    var poster = document.createElement("img");
    poster.setAttribute("src", r_poster);
    parent.appendChild(poster);

    var info = document.createElement("div");
    info.classList.add("information");
    construct_results_information(info, "results-title", r_title, "Title");
    construct_results_information(info, "results-year", r_date, "Year");
    construct_results_information(info, "results-genre", r_genres, "Genres");
    construct_results_information(info, "result-plot", r_plot, "Plot");
    construct_results_information(info, "result-plot", r_rating, "Rating");

    parent.appendChild(info);

    movies_info_area.style.display = "block";
    home.style.display = "none";
    movies_info_content.innerText = "";
    movies_info_content.appendChild(parent);
    console.log("Now showing more info");

    api = "https://api.themoviedb.org/3/movie/";
}
function back_btn_more_info() {
    var movies_info_area = document.getElementById("movies_info_area");
    var home = document.getElementById("top");

    movies_info_area.style.display = "none";
    home.style.display = "block";
}
function clear_results() {
    search_results.innerText = "";
    alert_box.innerText = "";
    alert_box.style.display = "none";
}