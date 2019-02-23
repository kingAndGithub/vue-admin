import Layout from '@/views/layout/Layout'
import jsons from '@/json/auth.json'

// 首字母大写
function strUpCase(str) {
  var array = str.split(' ')
  for (var i = 0; i < array.length; i++) {
    array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length)
  }
  return array.join(' ')
}

function getRouters() {
  const routers = []
  for (const v of jsons) {
    const children = []
    for (const c of v.children) {
      children.push({
        path: c.path,
        component: () => import(`@/views/${v.path}/${c.path}`),
        name: strUpCase(v.path) + strUpCase(c.path),
        meta: { title: c.name, noCache: true }
      })
    }
    routers.push({
      path: `/${v.path}`,
      component: Layout,
      redirect: `/${v.path}/${v.view}`,
      alwaysShow: true,
      meta: {
        title: v.name,
        icon: v.icon
      },
      children: children
    })
  }
  return routers
}

export default getRouters()
