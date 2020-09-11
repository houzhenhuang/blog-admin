import { login, logout, getInfo } from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  getTokenExpiration,
  setTokenExpiration,
  removeTokenExpiration,
  getRefreshTime,
  setRefreshTime,
  removeRefreshTime
} from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    expiration: getTokenExpiration(),
    refreshTime: getRefreshTime(),
    userName: '',
    realName: '',
    avatar: '',
    sex: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_TOKEN_EXPIRATION: (state, expiration) => {
    state.expiration = expiration
  },
  SET_REFRESH_TIME: (state, refreshTime) => {
    state.refreshTime = refreshTime
  },
  SET_REALNAME: (state, realName) => {
    state.realName = realName
  },
  SET_USERNAME: (state, userName) => {
    state.userName = userName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_SEX: (state, sex) => {
    state.sex = sex
  }
}

const actions = {
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  setTokenExpiration({ commit }, expiration) {
    commit('SET_TOKEN_EXPIRATION', expiration)
  },
  setRefreshTime({ commit }, refreshTime) {
    commit('SET_REFRESH_TIME', refreshTime)
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { token, expiration } = response
          commit('SET_TOKEN', token)
          setToken(token)
          commit('SET_TOKEN_EXPIRATION', expiration)
          setTokenExpiration(expiration)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          const { data } = response

          const { realName, sex, userName, avatar } = data

          commit('SET_REALNAME', realName)
          commit('SET_USERNAME', userName)
          commit('SET_AVATAR', avatar)
          commit('SET_SEX', sex)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          removeTokenExpiration()
          commit('RESET_STATE')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeTokenExpiration()
      removeRefreshTime()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
