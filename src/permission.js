import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  console.log(getToken())
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      const roles = store.getters.roles
      // TODO 未缓存 权限组，刷新页面权限丢失，系统默认退出
      if (roles.length === 0) {
        store.dispatch('ChangeRoles').then(res => {
          next({ ...to, replace: true })
        }).catch(err => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err)
            next({ path: '/' })
          })
        })
      } else {
        let obj
        switch (to.path) {
          case '/dashboard':
            break
          case '/404':
            break
          default:
            if (store.getters.name !== 'admin' && roles.indexOf(to.path) === -1) {
              Message.error('无权限访问')
              obj = { path: '/404' }
            }
            break
        }
        obj ? next(obj) : next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
