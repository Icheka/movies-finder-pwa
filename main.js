// constants
const movies_search = document.getElementById("movies-search");
const search_results = document.getElementById("search-results");
const search_dropdown = document.getElementById("search-dropdown");
// const apiKey = "553cc726";
const apiKey = "eba6955a2c5a4dace95fa4773c9bf2bc";
// var api = "http://www.omdbapi.com/?apikey=" + apiKey + "&";
var api = "https://api.themoviedb.org/3/movie/";
const home_spinner = document.getElementById("home-loading-spinner");

const imdb_id = document.getElementById("search-param-id");
const year_id = document.getElementById("search-param-year");
const type_id = document.getElementById("search-param-type");

// event listeners
window.addEventListener("load", () => {
    // loadSearchMovies();
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
    if  (movies_search.value != "") {
        // api += "&t=" + movies_search.value;
        api = "https://api.themoviedb.org/3/search/movie?callback=JSONP_CALLBACK&query=" + movies_search.value + "&sort_by=popularity.desc&api_key=" + apiKey;
    }
    
    // var xhr = new XMLHttpRequest();
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
    

    // xhr.onload = () => {
        // if (JSON.parse(xhr.responseText).Response == "False") {
        //     console.log("Does not exist!");
        //     createAlert("Movie not found!");
        //     api = "http://www.omdbapi.com/?apikey=" + apiKey + "&";
        // } else {
        //     console.log("Success");
        //     response = JSON.parse(xhr.responseText);
        //     r_title = response.Title;
        //     r_year = response.Year;
        //     r_rating = response.Rated;
        //     r_runtime = response.Runtime;
        //     r_genre = response.Genre;
        //     r_actors = response.Actors;
        //     r_plot = response.Plot;
        //     r_poster = response.Poster;
        //     console.log(response.Poster);
        //     displayResults(r_title, r_year, r_rating, r_runtime, r_genre, r_actors, r_plot, r_poster);
        // }
        console.log(xhr.responseText);
    // }
    xhr.onerror = (error) => {
        // api = "http://www.omdbapi.com/?apikey=" + apiKey + "&";
        console.log("Error" + error);
        caches.open(cacheName).then(cache => {
            alert(cache.match(api)) || alert("truly not found");
        });
        createAlert("Unable to load search results. <br /> Check your internet connection.");
    }
    xhr.open("get", api);

    xhr.send();
}
function createAlert(msg) {
    document.getElementById("search_alert").innerHTML = msg;
    document.getElementById("search_alert").style.display = "block";
}
function displayResults(r_title, r_year, r_rating, r_runtime, r_genre, r_actors, r_plot, r_poster) {
    document.getElementById("search_alert").style.display = "none";
    //
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
    construct_results_information(info, "results-runtime", r_runtime, "Runtime");
    construct_results_information(info, "results-genre", r_genre, "Genre");
    construct_results_information(info, "result-plot", r_plot, "Plot");
    construct_results_information(info, "results-actors", r_actors, "Actors");

    search_results.prepend(parent);

    home_spinner.style.display = "none";
    parent.appendChild(info);
    api = "http://www.omdbapi.com/?apikey=" + apiKey + "&";
}
function construct_results_information(info, span_class, span_value, span_tag) {
    var span = document.createElement("span");
    span.classList.add(span_class);
    span.innerHTML = "<a class='text-danger'>" + `${span_tag}:` + "</a>" +  `${span_value}`;
    temp = document.createElement("div");
    temp.appendChild(span);
    info.appendChild(temp);
}