const state = {
  tabs:
    sessionStorage.getItem('tabs') == null
      ? []
      : JSON.parse(sessionStorage.getItem('tabs')),
  activeName: '/home'
}

const mutations = {
  ADD_TAB: (state, tab) => {
    state.activeName = tab.fullPath

    if (state.tabs.some(t => t.fullPath === tab.fullPath)) return
    state.tabs.push(
      Object.assign({}, tab, {
        title: tab.meta.title || 'no-name'
      })
    )
    sessionStorage.setItem('tabs', JSON.stringify(state.tabs))
  },
  DEL_TAB: (state, tabName) => {
    state.tabs = state.tabs.filter(tab => tab.fullPath !== tabName)
    sessionStorage.setItem('tabs', JSON.stringify(state.tabs))
  },
  SET_ACTIVE_NAME: (state, activeName) => {
    state.activeName = activeName
  }
}

const actions = {
  addTab({ commit }, tab) {
    commit('ADD_TAB', tab)
  },
  delTab({ commit }, tabName) {
    commit('DEL_TAB', tabName)
  },
  setActiveName({ commit }, activeName) {
    commit('SET_ACTIVE_NAME', activeName)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
