import { getPermissionMenus } from '@/api/permission'
import { constantRoutes } from '@/router'

const state = {
  routes: []
}
const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = constantRoutes.concat(routes)
  }
}
const actions = {
  generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      getPermissionMenus()
        .then(response => {
          if (response.success) {
            const { data } = response
            commit('SET_ROUTES', data)
            resolve(data)
          } else {
            reject(response.message)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
