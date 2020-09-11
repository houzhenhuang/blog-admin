import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import {
  getToken,
  setToken,
  setTokenExpiration,
  getRefreshTime,
  setRefreshTime
} from '@/utils/auth'
import Vue from 'vue'
import { refreshTokenExpration } from '@/api/user'
import router from '@/router'
import date from './date'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.Authorization = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    var now = new Date()
    store.dispatch('user/setRefreshTime', now)
    setRefreshTime(now)
    const res = response.data
    return res
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm(
    //       'You have been logged out, you can cancel to stay on this page, or log in again',
    //       'Confirm logout',
    //       {
    //         confirmButtonText: 'Re-Login',
    //         cancelButtonText: 'Cancel',
    //         type: 'warning'
    //       }
    //     ).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
  },
  error => {
    if (error.response) {
      if (error.response.status == 401) {
        if (new Date(store.getters.expiration) < new Date()) {
          const refreshTime = getRefreshTime()
          if (
            new Date(refreshTime) >
            new Date(new Date().setMinutes(new Date().getMinutes() - 1)) //过期后，用户活跃时间超过规定时间段则返回登录页面
          ) {
            return refreshTokenExpration({
              token: store.getters.token
            }).then(response => {
              const { token, expiration } = response

              store.dispatch('user/setToken', token)
              setToken(token)
              store.dispatch('user/setTokenExpiration', expiration)
              setTokenExpiration(expiration)
              var now = new Date()
              store.dispatch('user/setRefreshTime', now)
              setRefreshTime(now)
              error.config.__isRetryRequest = true
              error.config.headers.Authorization = 'Bearer ' + token
              return service(error.config)
            })
          } else {
            store.dispatch('user/resetToken')
            router.replace({
              path: `/login`,
              query: { redirect: router.currentRoute.fullPath }
            })
          }
        } else {
          store.dispatch('user/resetToken')
          router.replace({
            path: `/login`,
            query: { redirect: router.currentRoute.fullPath }
          })
        }
      } else if (error.response.status == 403) {
        Message({
          message: '对不起,您没有操作权限,请联系管理员',
          type: 'error',
          duration: 5 * 1000
        })
      } else if (error.response.status == 400 || error.response.status == 500) {
        Message({
          message: error.response.data.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    var now = new Date()
    store.dispatch('user/setRefreshTime', now)
    setRefreshTime(now)
    return ''
  }
)

export default service
