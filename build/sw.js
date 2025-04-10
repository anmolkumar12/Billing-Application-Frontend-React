const cacheData = 'appUserInfo'
this.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheData).then((cache) => {
      cache.addAll([
        '/static/js/bundle.js',
        '/index.html',
        // '/login/basic',
        // '/vt',
        // 'brands/notAvailabe',
        // '/dashboard',
        '/manifest.json',
        '/favicon.ico',
        '/dashboard',
        '/',
      ])
    })
  )
})

this.addEventListener('fetch', (event) => {
  // console.log('resulttttttttttttt', event)
  if (!navigator.onLine) {
    event.respondWith(
      caches.match(event.request).then((result) => {
        // console.log(result, 'resulttttttttttttt')
        if (result) {
          return result
        }
        const requestUrl = event.request.clone()
        return fetch(requestUrl)
      })
    )
  }
})

console.log('code is ready to run')
