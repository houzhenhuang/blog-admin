import request from '@/utils/request'

export function getMenus() {
  return request({
    url: '/api/menu/GetMenus',
    method: 'get'
  })
}

export function addMenu(data) {
  return request({
    url: '/api/menu/addMenu',
    method: 'post',
    data
  })
}
export function editMenu(data) {
  return request({
    url: '/api/menu/editMenu',
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
