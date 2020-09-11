import request from '@/utils/request'

export function getRolesByPage(data) {
  return request({
    url: '/api/role/getRolesByPage',
    method: 'get',
    params: data
  })
}
export function getRoles(data) {
  return request({
    url: '/api/role/getRoles',
    method: 'get',
    params: data
  })
}

export function addRole(data) {
  return request({
    url: '/api/role/addRole',
    method: 'post',
    data
  })
}
export function editRole(data) {
  return request({
    url: '/api/role/editRole',
    method: 'put',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/api/role/deleteRole',
    method: 'delete',
    params: data
  })
}
