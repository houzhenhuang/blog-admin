import request from '@/utils/request'

export function getOperationsByMenuId(data) {
  return request({
    url: '/api/operation/getOperationsByMenuId',
    method: 'get',
    params: data
  })
}

export function addOperation(data) {
  return request({
    url: '/api/operation/addOperation',
    method: 'post',
    data
  })
}
export function editOperation(data) {
  return request({
    url: '/api/operation/editOperation',
    method: 'put',
    data
  })
}

export function deleteOperation(data) {
  return request({
    url: '/api/operation/deleteOperation',
    method: 'delete',
    params: data
  })
}
