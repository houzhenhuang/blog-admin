import Cookies from 'js-cookie'

const TokenKey = 'blog_vue_admin_token'
const TokenExpirationKey = 'blog_vue_admin_token_expiration'
const RefreshTimeKey = 'blog_vue_admin_refresh_time'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTokenExpiration() {
  return Cookies.get(TokenExpirationKey)
}
export function setTokenExpiration(expiration) {
  return Cookies.set(TokenExpirationKey, expiration)
}
export function removeTokenExpiration() {
  return Cookies.remove(TokenExpirationKey)
}

export function getRefreshTime() {
  return Cookies.get(RefreshTimeKey)
}
export function setRefreshTime(refreshTime) {
  return Cookies.set(RefreshTimeKey, refreshTime)
}
export function removeRefreshTime() {
  return Cookies.remove(RefreshTimeKey)
}
