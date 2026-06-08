import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  
  Router.beforeEach((to, from, next) => {
    const requiresAdmin = to.matched.some(r => r.meta.requiresAdmin)
    if (!requiresAdmin) return next() 

    const token = localStorage.getItem('adminToken')
    if (!token) return next('/adminlogin')

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role !== 'admin') return next('/')  
      next()  
    } catch {
      return next('/adminlogin')  
    }
  })

  return Router
})
