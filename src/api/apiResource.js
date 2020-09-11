import request from '@/utils/request'

export function getApiResourcesByPage(data) {
  return request({
    url: '/api/apiResource/getApiResourcesByPage',
    method: 'get',
    params: data
  })
}
export function getApiResources() {
  return request({
    url: '/api/apiResource/getApiResources',
    method: 'get'
  })
}
export function addApiResource(data) {
  return request({
    url: '/api/apiResource/addApiResource',
    method: 'post',
    data
  })
}
export function editApiResource(data) {
  return request({
    url: '/api/apiResource/editApiResource',
    method: 'put',
    data
  })
}

export function deleteApiResource(data) {
  return request({
    url: '/api/apiResource/deleteApiResource',
    method: 'delete',
    params: data
  })
}
