importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);

workbox.precaching.precacheAndRoute(
  [
    { url: "/", revision: "1" },
    { url: "/index.html", revision: "1" },
    { url: "/nav.html", revision: "1" },
    { url: "/manifest.json", revision: "1" },
    { url: "/sw-register.js", revision: "1" },
    { url: "/push-handle.js", revision: "1" },
    { url: "/js/api.js", revision: "1" },
    { url: "/js/idb.js", revision: "1" },
    { url: "/js/materialize.min.js", revision: "1" },
    { url: "/js/nav.js", revision: "1" },
    { url: "/js/pages.js", revision: "1" },
    { url: "/css/materialize.min.css", revision: "1" },
    { url: "/images/icons/icon-128x128.png", revision: "1" },
    { url: "/images/icons/icon-144x144.png", revision: "1" },
    { url: "/images/icons/icon-152x152.png", revision: "1" },
    { url: "/images/icons/icon-192x192.png", revision: "1" },
    { url: "/images/icons/icon-384x384.png", revision: "1" },
    { url: "/images/icons/icon-512x512.png", revision: "1" },
    { url: "/images/icons/icon-72x72.png", revision: "1" },
    { url: "/images/icons/icon-96x96.png", revision: "1" },
  ],
  {
    ignoreUrlParametersMatching: [/.*/],
  }
);

workbox.routing.registerRoute(
  new RegExp("https://api.football-data.org/v2/"),
  new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: "images",
    plugin: [
      new workbox.expiration.Plugin({
        maxEntries: 22,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "static-resources",
  })
);

workbox.routing.registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
  })
);

self.addEventListener("push", (event) => {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  let options = {
    body: body,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
