cacheName = "version1";
cacheList = [
    "/",
    "index.html",
    "manifest.json",
    "assets/static/css/mobile.css",
    "assets/static/img/icon144.png",
    "assets/static/js/main.js",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    "assets/static/css/bootstrap.min.css",
    "https://fonts.googleapis.com/css?family=Lato:400,700",
    "https://fonts.googleapis.com/css?family=Montserrat:400,700"
];

self.addEventListener("install", event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(cacheList);
        })
    );
    console.log("SW installed");

});

self.addEventListener("activate", () => {
    console.log("SW activated");
});

// self.addEventListener("fetch", event => {
//     event.respondWith(
//         caches.match(event.request)
//     )
// })


self.addEventListener("fetch", event => {
    var url = event.request.url;
    if (url.indexOf("https://api.themoviedb.org") === 0) {
        return for_searches(event, url);
    }

    console.log("from fetch:: " + event.request.url);
    event.respondWith(
        caches.open(cacheName).then(cache => {
            return cache.match(event.request).then(item => {
                let fetchPromise = fetch(event.request).then(response => {
                    cache.put(event.request, response.clone());
                    return response;
                });
                event.waitUntil(fetchPromise);
                return item;
            })
        })
    );
});

function for_searches(event) {
    event.respondWith(
        caches.match(event.request).then(item => {
            return item || fetch(event.request).then(res => {
                return caches.open(cacheName).then(cache => {
                    cache.put(event.request, res.clone());
                    return res;
                });
            });
        })
    );
}