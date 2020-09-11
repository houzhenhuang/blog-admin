import request from '@/utils/request'

export function getRolesByUser(data) {
  return request({
    url: '/api/userRole/getRolesByUser',
    method: 'get',
    params: data
  })
}
export function disRole(data) {
  return request({
    url: '/api/userRole/disRole',
    method: 'patch',
    data
  })
}
