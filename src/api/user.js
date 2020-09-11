import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/account/login',
    method: 'post',
    data
  })
}
export function refreshTokenExpration(data) {
  return request({
    url: '/api/account/refreshToken',
    method: 'get',
    params: data
  })
}

export function getInfo() {
  return request({
    url: '/api/user/getUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}

export function getUsersByPage(data) {
  return request({
    url: '/api/user/getUsersByPage',
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/api/user/addUser',
    method: 'post',
    data
  })
}
export function editUser(data) {
  return request({
    url: '/api/user/editUser',
    method: 'put',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/api/user/deleteUser',
    method: 'delete',
    params: data
  })
}
