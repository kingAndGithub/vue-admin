import request from '@/utils/request'

export function loginByUsername(username, password) {
  // const data = {
  //   username,
  //   password
  // }
  // return request({
  //   url: '/login/login',
  //   method: 'post',
  //   data
  // })
  return new Promise((resolve) => {
    resolve({
      data: {
        roles: ['/admin/list'],
        name: 'admin',
        token: new Date().valueOf()
      }
    })
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  // return request({
  //   url: '/user/info',
  //   method: 'get',
  //   params: { token }
  // })
  return new Promise((resolve) => {
    resolve({
      data: {
        roles: ['/admin/list'],
        name: 'admin'
      }
    })
  })
}

