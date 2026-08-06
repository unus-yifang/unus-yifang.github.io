import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Tools from '../pages/Tools.vue'
import Fish from '../pages/Fish.vue'
import Discover from '../pages/Discover.vue'
import Customize from '../pages/Customize.vue'
import Support from '../pages/Support.vue'
import Admin from '../pages/Admin.vue'
import Profile from '../pages/Profile.vue'
import Login from '../pages/Login.vue'
import About from '../pages/About.vue'
import { useUserStore } from '../stores/user'

const routes = [
  { path: '/', component: Home },
  { path: '/tools', component: Tools, meta: { requiresAuth: true } },
  { path: '/fish', component: Fish, meta: { requiresAuth: true } },
  { path: '/discover', component: Discover, meta: { requiresAuth: true } },
  { path: '/customize', component: Customize, meta: { requiresAuth: true } },
  { path: '/support', component: Support, meta: { requiresAuth: true } },
  { 
    path: '/admin', 
    component: Admin, 
    meta: { requiresAuth: true, requiresAdmin: true } 
  },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/about', component: About },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // ===== 处理 404 重定向保留的路径 =====
  const redirectPath = sessionStorage.getItem('redirect_path')
  if (redirectPath && to.path === '/') {
    sessionStorage.removeItem('redirect_path')
    // 如果目标路径就是根路径，直接放行
    if (redirectPath === '/') {
      next()
      return
    }
    // 否则跳转到保存的路径
    next({ path: redirectPath })
    return
  }
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }
  
  if (to.meta.requiresAdmin) {
    const user = userStore.user
    const isAdmin = user?.email === '3931095272@qq.com' && userStore.username === 'Gesoleerdeiland'
    if (!isAdmin) {
      next({ path: '/' })
      return
    }
  }
  
  if (to.path === '/login' && userStore.isLoggedIn) {
    const redirectPath = localStorage.getItem('unus_redirect')
    localStorage.removeItem('unus_redirect')
    if (redirectPath) {
      next({ path: redirectPath })
      return
    }
    next({ path: '/' })
    return
  }
  
  next()
})

export default router