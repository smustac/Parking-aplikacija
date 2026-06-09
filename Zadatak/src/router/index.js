import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

export default defineRouter(function (/* { store, ssrContext } */) {
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

  // ✅ Global admin route guard
  Router.beforeEach((to, from, next) => {
    const requiresAdmin = to.matched.some(r => r.meta.requiresAdmin)
    if (!requiresAdmin) return next()  // not an admin route

    const token = localStorage.getItem('adminToken')
    if (!token) return next('/adminlogin')

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role !== 'admin') return next('/')  // logged in but not admin
      next()  // admin OK
    } catch {
      return next('/adminlogin')  // invalid token
    }
  })

  // Guard za parking stranicu - provjeri zauzeto mjesto
Router.beforeEach(async (to, from, next) => {
  if (from.path !== '/parking') return next()

  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!user?.id) return next()

  try {
    const res = await fetch('http://localhost:3000/api/parking', {
      headers: {
        'x-user-id': user.id,
        'x-user-role': user.role || 'student'
      }
    })
    const spots = await res.json()
    const hasSpot = spots.some(s => s.taken_by == user.id)

    if (hasSpot) {
      window.alert('Nemožete izaći sa zauzetim parking mjestom!')
      return next(false)
    }
  } catch {
    // ako API ne odgovori, pusti prolaz
  }

  next()
})


  return Router
})

