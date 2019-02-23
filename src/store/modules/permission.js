import { constantRouterMap, asyncRouterMap } from '@/router'
import { deepClone } from '@/utils/index'
import router from '../../router'

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles ['admin/list', 'admin/show', 'user/list']
 */
function filterAsyncRouter(routes, roles) {
  const res = []
  for (const route of routes) {
    let pm = null
    const routePath = route.path
    if (route.children && route.children.length > 0) {
      const childs = []
      for (const c of route.children) {
        const childPath = `${routePath}/${c.path}`
        if (roles.includes(childPath)) {
          childs.push(c)
        }
      }
      if (childs.length > 0) {
        pm = deepClone(route)
        pm.children = childs
      }
    }
    pm ? res.push(pm) : null
  }

  return res
}

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      router.addRoutes(state.addRouters) // 动态添加可访问路由表
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles, name } = data
        let accessedRouters
        if (name === 'admin') {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
