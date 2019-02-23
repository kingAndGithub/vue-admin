import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(state.token)
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit, dispatch }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', 'avatar.gif')
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限 (刷新页面时，重新获取用户信息)
    ChangeRoles({ commit, dispatch }, token) {
      return new Promise((resolve, reject) => {
        getUserInfo(token).then(response => {
          if (!response.data) {
            reject('登陆失败')
          }
          const data = response.data
          commit('SET_TOKEN', token)
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', 'avatar.gif')
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default user
