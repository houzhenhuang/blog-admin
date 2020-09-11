import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', icon: 'home', isMenuItem: true }
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/example/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/example/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },
  {
    path: '/blog',
    component: Layout,
    redirect: '/blog/list',
    name: '博客管理',
    children: [
      {
        path: '/blog/list',
        name: '博客列表',
        component: () => import('@/views/blog/list/index'),
        meta: { title: '博客管理', icon: 'table' }
      }
    ]
  },
  {
    path: '/basic',
    component: Layout,
    redirect: '/basic/user',
    name: '基本设置',
    children: [
      {
        path: '/basic/user',
        name: '用户管理',
        component: () => import('@/views/basic/user/index'),
        meta: { title: '用户管理', icon: 'table' }
      },
      {
        path: '/basic/role',
        name: '角色管理',
        component: () => import('@/views/basic/role/index'),
        meta: { title: '角色管理', icon: 'table' }
      },
      {
        path: '/basic/api',
        name: '接口管理',
        component: () => import('@/views/basic/api/index'),
        meta: { title: '接口管理', icon: 'table' }
      },
      {
        path: '/basic/menu',
        name: '菜单管理',
        component: () => import('@/views/basic/menu/index'),
        meta: { title: '菜单管理', icon: 'table' }
      },
      {
        path: '/basic/operation',
        name: '操作权限',
        component: () => import('@/views/basic/operation/index'),
        meta: { title: '操作权限', icon: 'table' }
      },
      {
        path: '/basic/permission',
        name: '权限分配',
        component: () => import('@/views/basic/permission/index'),
        meta: { title: '权限分配', icon: 'table' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/person-center',
    name: '系统管理',
    children: [
      {
        path: '/system/person-center',
        name: '个人中心',
        component: () => import('@/views/system/person-center/index'),
        meta: { title: '个人中心', icon: 'table' }
      }
    ]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () =>
                  import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () =>
                  import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes.concat(asyncRoutes)
  })

const router = createRouter()

export function filterAsyncRouter(asyncRouter) {
  const accessRoutes = asyncRouter.filter(route => {
    if (route.parentId === 0) {
      route.component = Layout
    } else {
      route.component = loadView('@/views' + route.path) // () => import('@/views' + route.path + '/index')
    }
    if (route.children && route.children.length) {
      filterAsyncRouter(route.children)
    }
    return true
  })
  return accessRoutes
}
const loadView = view => {
  // 路由懒加载
  return (resolve) => require([`${view}`], resolve)
}
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
