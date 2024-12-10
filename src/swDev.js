export default function swDev() {
  const swURL = `${process.env.PUBLIC_URL}/sw.js`
  navigator.serviceWorker
    .register(swURL)
    .then((res) => {
      console.log('ressssss', res)
    })
    .catch((error) => {
      console.log(error)
    })
}
