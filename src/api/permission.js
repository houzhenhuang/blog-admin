import request from '@/utils/request'

export function getPermissionMenus() {
  return request({
    url: '/api/permission/getPermissionMenus',
    method: 'get'
  })
}
export function getMenus() {
  return request({
    url: '/api/permission/GetMenus',
    method: 'get'
  })
}

export function addMenu(data) {
  return request({
    url: '/api/permission/addMenu',
    method: 'post',
    data
  })
}
export function editMenu(data) {
  return request({
    url: '/api/permission/editMenu',
    method: 'put',
    data
  })
}

export function deleteMenu(data) {
  return request({
    url: '/api/permission/deleteMenu',
    method: 'delete',
    params: data
  })
}

export function getPermissions() {
  return request({
    url: '/api/permission/getPermissions',
    method: 'get'
  })
}

export function saveRolePermission(data) {
  return request({
    url: '/api/permission/saveRolePermission',
    method: 'post',
    data
  })
}
