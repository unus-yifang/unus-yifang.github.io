<template>
  <aside class="sidebar glass-nav w-[180px] min-w-[180px] h-full flex flex-col px-3 py-4">

    <div class="flex items-center px-2 pb-4 mb-2 border-b border-white/20">
      <span class="logo-text text-gray-800 font-bold text-lg tracking-tight">
        Unus <span class="text-accent font-light">·</span> 一方
      </span>
    </div>

    <nav class="flex-1 flex flex-col gap-0.5 py-1">
      <router-link to="/" class="nav-item" active-class="active" exact-active-class="active">
        <i class="fas fa-house"></i><span class="nav-label">首页</span>
      </router-link>
      <router-link to="/tools" class="nav-item" active-class="active">
        <i class="fas fa-screwdriver-wrench"></i><span class="nav-label">工具</span>
      </router-link>
      <router-link to="/fish" class="nav-item" active-class="active">
        <i class="fas fa-fish"></i><span class="nav-label">摸鱼</span>
      </router-link>
      <router-link to="/discover" class="nav-item" active-class="active">
        <i class="fas fa-compass"></i><span class="nav-label">发现</span>
      </router-link>
      <router-link to="/customize" class="nav-item" active-class="active">
        <i class="fas fa-palette"></i><span class="nav-label">自定义</span>
      </router-link>
      <router-link to="/support" class="nav-item" active-class="active">
        <i class="fas fa-heart"></i><span class="nav-label">支持</span>
      </router-link>
      <router-link to="/about" class="nav-item" active-class="active">
        <i class="fas fa-book"></i><span class="nav-label">关于</span>
      </router-link>
      <router-link
        v-if="isAdmin"
        to="/admin"
        class="nav-item"
        active-class="active"
      >
        <i class="fas fa-tools"></i><span class="nav-label">管理</span>
      </router-link>
    </nav>

    <div class="mt-auto">
      <div class="flex items-center gap-2 px-2 py-2 text-gray-700 text-sm">
        <i class="fas fa-coins text-accent"></i>
        <span>{{ userStore.ucoins }}</span>
        <span class="text-gray-400 text-xs">U币</span>
      </div>

      <div class="border-t border-white/20 my-1"></div>

      <router-link to="/profile" class="nav-user-card">
        <img :src="userStore.avatar" alt="avatar" class="avatar-sm" />
        <div class="flex flex-col overflow-hidden">
          <span class="username">{{ userStore.username }}</span>
          <span class="sub-text">{{ userStore.isLoggedIn ? '查看资料' : '点击登录' }}</span>
        </div>
        <i class="fas fa-chevron-right text-gray-400 text-[10px] ml-auto"></i>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const isAdmin = computed(() => {
  if (!userStore.isLoggedIn) return false
  const user = userStore.user
  return user?.email === '3931095272@qq.com' && userStore.username === 'Gesoleerdeiland'
})
</script>

<style scoped>
.sidebar {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.30);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  color: rgba(60, 60, 70, 0.65);
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.85rem;
  text-decoration: none;
  white-space: nowrap;
}
.nav-item:hover {
  background: rgba(255, 255, 255, 0.40);
  color: rgba(30, 30, 40, 0.9);
}
.nav-item.active {
  background: rgba(255, 255, 255, 0.50);
  color: rgba(20, 20, 30, 0.95);
}
.nav-item i {
  width: 18px;
  text-align: center;
  font-size: 1rem;
}

.nav-user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}
.nav-user-card:hover {
  background: rgba(255, 255, 255, 0.25);
}
.nav-user-card .username {
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(40, 40, 50, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70px;
}
.nav-user-card .sub-text {
  font-size: 0.6rem;
  color: rgba(80, 80, 90, 0.5);
}

.avatar-sm {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.40);
  flex-shrink: 0;
}

.logo-text {
  font-size: 1.1rem;
}
</style>