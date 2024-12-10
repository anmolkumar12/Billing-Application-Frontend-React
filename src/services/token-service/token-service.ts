import Cookies from 'universal-cookie'

export const TokenService = () => {
  const cookies = new Cookies()
  const dateNow = new Date()
  dateNow.setDate(dateNow.getDate() + 7)

  const setToken = (accessToken: string) => {
    clearAllToken()
    cookies.set('accessToken', accessToken, { expires: dateNow, path: '/' })
    // cookies.set('refreshToken', refreshToken, { expires: dateNow, path: '/' })
  }

  const getAccessToken = () => {
    return cookies.get('accessToken')
  }

  // const getRefreshToken = () => {
  //   return cookies.get('refreshToken')
  // }

  const clearAllToken = () => {
    cookies.remove('accessToken', { path: '/' })
    cookies.remove('refreshToken', { path: '/' })
    cookies.remove('x-origin', { path: '/' })
    cookies.remove('x-domain', { path: '/' })
  }

  const clearAccessToken = () => {
    cookies.remove('accessToken', { path: '/' })
  }

  const setXDomain = (domain: string) => {
    cookies.set('x-domain', domain, { expires: dateNow, path: '/' })
  }

  const getXDomain = () => {
    return cookies.get('x-domain')
  }

  const setOrigin = (origin: string) => {
    cookies.set('x-origin', origin, { expires: dateNow, path: '/' })
  }

  const getOrigin = () => {
    return cookies.get('x-origin')
  }

  const clearOriginDomain = () => {
    cookies.remove('x-domain')
    cookies.remove('x-origin')
  }

  return {
    setToken: setToken,
    getAccessToken: getAccessToken,
    // getRefreshToken: getRefreshToken,
    clearAllToken: clearAllToken,
    getDomain: getXDomain,
    setDomain: setXDomain,
    setOrigin: setOrigin,
    getOrigin: getOrigin,
    clearOriginDomain: clearOriginDomain,
    clearAccessToken: clearAccessToken,
  }
}
