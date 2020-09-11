import request from '@/utils/request'

export function getRolePermissions(data) {
  return request({
    url: '/api/rolePermission/getRolePermissions',
    method: 'get',
    params: data
  })
}

export function saveRolePermission(data) {
  return request({
    url: '/api/rolePermission/saveRolePermission',
    method: 'post',
    data
  })
}
