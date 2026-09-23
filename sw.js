// Retire the previous root worker for returning visitors.
// The company website does not install a new service worker.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.registration.unregister());
});
