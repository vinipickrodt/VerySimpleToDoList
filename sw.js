var CACHE_NAME = 'base-cache';
var urlsToCache = [
    './index.html',
    './css/main.css',
    './js/main.js'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    var url = event.request.url;
    var req = event.request;

    // // debugger;

    // if (url == "http://localhost:8080/") {
    //     req = new Request("http://localhost:8080/index.html");
    // }

    event.respondWith(
        caches.match(req)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(req).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(req, responseToCache);
                            });

                        return response;
                    });
            })
    );
});

self.addEventListener('activate', function (event) {
    console.log("sw - activate");
    // var cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];

    // event.waitUntil(
    //     caches.keys().then(function (cacheNames) {
    //         return Promise.all(
    //             cacheNames.map(function (cacheName) {
    //                 if (cacheWhitelist.indexOf(cacheName) === -1) {
    //                     return caches.delete(cacheName);
    //                 }
    //             })
    //         );
    //     })
    // );
});