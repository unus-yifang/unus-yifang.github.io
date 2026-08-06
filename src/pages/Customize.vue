<template>
  <div class="customize-container w-full max-w-3xl mx-auto px-4 py-6">

    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-white drop-shadow-lg tracking-tight">
        🎨 自定义装扮
      </h1>
      <p class="text-white/50 text-sm mt-2">
        打造属于你自己的专属首页 · 所有更改自动保存并刷新
      </p>
    </div>

    <!-- ===== 未订阅：引导 ===== -->
    <div v-if="!isSubscribed" class="custom-card rounded-2xl p-8 border text-center">
      <div class="text-6xl mb-4">🔒</div>
      <h2 class="text-2xl font-bold text-white mb-2">订阅解锁自定义装扮</h2>
      <p class="text-white/60 text-sm mb-6 max-w-md mx-auto">
        自定义壁纸、主题色，打造属于你自己的专属首页
      </p>
      <div class="flex flex-wrap justify-center gap-6 mb-6 text-white/60 text-sm">
        <div class="flex items-center gap-2"><span class="text-green-400">✅</span> 自定义壁纸</div>
        <div class="flex items-center gap-2"><span class="text-green-400">✅</span> 自定义主题色</div>
      </div>
      <router-link to="/support" class="inline-block px-8 py-3 rounded-xl bg-accent/20 border border-accent/30 text-accent font-medium hover:bg-accent/30 transition">
        前往订阅 →
      </router-link>
    </div>

    <!-- ===== 已订阅：自定义内容 ===== -->
    <div v-else class="space-y-6">

      <div class="custom-card rounded-xl p-4 border border-accent/20 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl">✨</span>
          <div>
            <div class="text-white font-medium">{{ userStore.subscriptionDisplay }}</div>
            <div class="text-white/50 text-xs">有效期至 {{ formatDate(userStore.subscriptionExpiresAt) }}</div>
          </div>
        </div>
        <router-link to="/support" class="text-accent text-sm hover:underline">续费 →</router-link>
      </div>

      <!-- ===== 壁纸 ===== -->
      <div class="custom-card rounded-xl p-5 border">
        <h3 class="section-title text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
          <i class="fas fa-image text-accent"></i> 壁纸
        </h3>
        <div class="flex flex-wrap gap-2 mb-3">
          <button
            v-for="option in wallpaperOptions"
            :key="option.value"
            @click="saveWallpaperPreference(option.value)"
            class="px-4 py-2 rounded-lg text-sm font-medium transition border"
            :class="wallpaperPreference === option.value ? 'bg-accent/20 border-accent/30 text-accent' : 'bg-white/10 border-white/10 text-white/70 hover:bg-white/20'"
          >
            {{ option.label }}
          </button>
        </div>

        <div v-if="wallpaperPreference === 'fixed'" class="flex gap-2">
          <input
            v-model="customWallpaperUrl"
            type="text"
            placeholder="输入图片链接 (https://...)"
            class="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 outline-none focus:border-accent/50"
          />
          <button
            @click="saveCustomWallpaper"
            class="px-4 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/30 transition whitespace-nowrap"
          >
            保存并刷新
          </button>
        </div>

        <div v-if="wallpaperPreference === 'solid'" class="flex items-center gap-3">
          <input
            type="color"
            v-model="solidColor"
            class="w-12 h-12 rounded-lg cursor-pointer border border-white/20 bg-transparent p-1"
          />
          <span class="text-white/50 text-xs">选择颜色，点击下方按钮保存</span>
          <button
            @click="saveSolidColor"
            class="px-4 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/30 transition whitespace-nowrap"
          >
            保存并刷新
          </button>
        </div>

        <div v-if="customWallpaperUrl && wallpaperPreference === 'fixed'" class="mt-3">
          <p class="text-white/40 text-xs mb-1">当前壁纸预览：</p>
          <img :src="customWallpaperUrl" alt="壁纸预览" class="w-full max-h-40 object-cover rounded-lg border border-white/10" @error="handleImageError" />
        </div>
        <div v-if="wallpaperPreference === 'solid' && solidColor" class="mt-3">
          <p class="text-white/40 text-xs mb-1">当前纯色预览：</p>
          <div class="w-full h-20 rounded-lg border border-white/10" :style="{ backgroundColor: solidColor }"></div>
          <p class="text-white/40 text-xs mt-1">{{ solidColor }}</p>
        </div>
      </div>

      <!-- ===== 主题色 ===== -->
      <div class="custom-card rounded-xl p-5 border">
        <h3 class="section-title text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
          <i class="fas fa-palette text-accent"></i> 主题色（点击后刷新页面）
        </h3>
        <p class="text-white/50 text-xs mb-2">头像背景色将同步跟随主题色</p>
        <div class="flex flex-wrap gap-3 items-center">
          <button
            v-for="color in colorOptions"
            :key="color.value"
            @click="saveThemeColor(color.value)"
            class="w-10 h-10 rounded-full border-2 transition hover:scale-110"
            :class="themeColor === color.value ? 'border-accent shadow-lg shadow-accent/20' : 'border-white/20'"
            :style="{ backgroundColor: color.value }"
            :title="color.label"
          ></button>
          <input
            type="color"
            v-model="customThemeColor"
            class="w-10 h-10 rounded-full cursor-pointer border-2 border-white/20 bg-transparent p-0.5 hover:scale-110 transition"
            title="自定义颜色"
            @change="saveThemeColor(customThemeColor)"
          />
        </div>
        <div class="mt-3 text-white/50 text-xs">
          当前主题色：<span class="text-white" :style="{ color: themeColor }">{{ themeColor }}</span>
        </div>
        <div class="mt-3 flex items-center gap-3">
          <span class="text-white/50 text-xs">头像预览：</span>
          <img
            :src="userStore.avatar"
            alt="头像预览"
            class="w-10 h-10 rounded-full border-2"
            :style="{ borderColor: themeColor }"
            :key="userStore.avatar"
          />
          <span class="text-white/40 text-xs">背景色跟随主题色</span>
        </div>
      </div>

      <!-- ===== 重置 ===== -->
      <div class="custom-card rounded-xl p-5 border border-red-500/20">
        <h3 class="section-title text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
          <i class="fas fa-undo text-red-400"></i> 重置
        </h3>
        <p class="text-white/50 text-xs mb-3">重置所有自定义设置为默认值</p>
        <button
          @click="resetAll"
          class="px-6 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/30 transition"
        >
          重置所有设置
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { supabase } from '../lib/supabase'

const userStore = useUserStore()

// ============================================================
// 订阅状态
// ============================================================
const isSubscribed = computed(() => userStore.effectiveSubscription !== 'free')

function formatDate(dateStr) {
  if (!dateStr) return '永久'
  const d = new Date(dateStr)
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

// ============================================================
// 壁纸
// ============================================================
const wallpaperPreference = ref('daily')
const customWallpaperUrl = ref('')
const solidColor = ref('#1a1a2e')

const wallpaperOptions = [
  { value: 'daily', label: '🌅 每日随机' },
  { value: 'fixed', label: '🖼️ 固定壁纸' },
  { value: 'solid', label: '🎨 纯色背景' },
]

async function loadWallpaperPreference() {
  if (userStore.isLoggedIn && userStore.profile) {
    wallpaperPreference.value = userStore.profile.wallpaper_preference || 'daily'
    customWallpaperUrl.value = userStore.profile.wallpaper_url || ''
    if (wallpaperPreference.value === 'solid' && userStore.profile.wallpaper_color) {
      solidColor.value = userStore.profile.wallpaper_color
    }
  }
}

async function saveWallpaperPreference(value) {
  wallpaperPreference.value = value
  if (!userStore.isLoggedIn) return

  const { error } = await supabase
    .from('profiles')
    .update({ wallpaper_preference: value })
    .eq('id', userStore.user.id)

  if (error) {
    console.error('保存壁纸偏好失败:', error)
    alert('保存失败：' + error.message)
    return
  }
  userStore.profile.wallpaper_preference = value
  window.location.reload()
}

async function saveCustomWallpaper() {
  const url = customWallpaperUrl.value.trim()
  if (!url) {
    alert('请输入图片链接')
    return
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      wallpaper_preference: 'fixed',
      wallpaper_url: url,
    })
    .eq('id', userStore.user.id)

  if (error) {
    console.error('保存壁纸失败:', error)
    alert('保存失败：' + error.message)
    return
  }

  wallpaperPreference.value = 'fixed'
  userStore.profile.wallpaper_preference = 'fixed'
  userStore.profile.wallpaper_url = url
  window.location.reload()
}

async function saveSolidColor() {
  const color = solidColor.value
  if (!color) {
    alert('请选择颜色')
    return
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      wallpaper_preference: 'solid',
      wallpaper_color: color,
    })
    .eq('id', userStore.user.id)

  if (error) {
    console.error('保存纯色失败:', error)
    alert('保存失败：' + error.message)
    return
  }

  wallpaperPreference.value = 'solid'
  userStore.profile.wallpaper_preference = 'solid'
  userStore.profile.wallpaper_color = color
  window.location.reload()
}

function handleImageError(e) {
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"%3E%3Crect width="400" height="200" fill="%23222222"/%3E%3Ctext x="200" y="110" text-anchor="middle" fill="%23666666" font-size="14" font-family="sans-serif"%3E图片加载失败%3C/text%3E%3C/svg%3E'
}

// ============================================================
// 主题色（修复跨账号共享问题）
// ============================================================
const themeColor = ref('#d4af37')
const customThemeColor = ref('#d4af37')

const colorOptions = [
  { value: '#d4af37', label: '金色' },
  { value: '#4A90D9', label: '蓝色' },
  { value: '#FF6B6B', label: '珊瑚红' },
  { value: '#51CF66', label: '翠绿' },
  { value: '#CC5DE8', label: '紫色' },
  { value: '#FF922B', label: '橙色' },
  { value: '#FFFFFF', label: '白色' },
]

function loadThemeColor() {
  // 从 localStorage 读取（用于页面展示）
  const saved = localStorage.getItem('unus_theme_color') || '#d4af37'
  themeColor.value = saved
  customThemeColor.value = saved
  applyThemeColor(saved)
}

async function saveThemeColor(value) {
  themeColor.value = value
  customThemeColor.value = value
  localStorage.setItem('unus_theme_color', value)
  applyThemeColor(value)

  // ===== 保存到数据库 =====
  if (userStore.isLoggedIn) {
    try {
      await userStore.updateThemeColor(value)
    } catch (err) {
      console.error('保存主题色到数据库失败:', err)
      alert('保存主题色失败：' + err.message)
      return
    }
  }

  userStore.refreshAvatar()
  setTimeout(() => { window.location.reload() }, 100)
}

function applyThemeColor(color) {
  document.documentElement.style.setProperty('--accent-color', color)
}

// ============================================================
// 重置
// ============================================================
async function resetAll() {
  if (!confirm('确定要重置所有自定义设置为默认值吗？此操作不可撤销！')) return

  wallpaperPreference.value = 'daily'
  customWallpaperUrl.value = ''
  solidColor.value = '#1a1a2e'

  const defaultColor = '#d4af37'
  themeColor.value = defaultColor
  customThemeColor.value = defaultColor
  localStorage.setItem('unus_theme_color', defaultColor)
  applyThemeColor(defaultColor)

  // ===== 重置数据库中的主题色 =====
  if (userStore.isLoggedIn) {
    try {
      await userStore.updateThemeColor(defaultColor)
    } catch (err) {
      console.error('重置主题色失败:', err)
    }
  }

  userStore.refreshAvatar()

  if (userStore.isLoggedIn) {
    const { error } = await supabase
      .from('profiles')
      .update({
        wallpaper_preference: 'daily',
        wallpaper_url: null,
        wallpaper_color: null,
      })
      .eq('id', userStore.user.id)

    if (error) {
      console.error('重置失败:', error)
      alert('重置失败：' + error.message)
      return
    }
    userStore.profile.wallpaper_preference = 'daily'
    userStore.profile.wallpaper_url = null
    userStore.profile.wallpaper_color = null
  }

  alert('✅ 已重置所有设置为默认值')
  window.location.reload()
}

// ============================================================
// 生命周期
// ============================================================
onMounted(() => {
  loadWallpaperPreference()
  loadThemeColor()
})
</script>

<style scoped>
.custom-card {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border-color: rgba(255, 255, 255, 0.40) !important;
}

.custom-card :not(.section-title):not(.text-accent):not(.text-green-400):not(.text-red-400):not(.text-white\/40) {
  color: #1a1a2e !important;
}

.section-title {
  color: #1a1a2e !important;
}
.section-title .text-accent {
  color: #d4af37 !important;
}

.custom-card .text-accent {
  color: #d4af37 !important;
}
.custom-card .text-green-400 {
  color: #4ade80 !important;
}
.custom-card .text-red-400 {
  color: #f87171 !important;
}

.custom-card input,
.custom-card select,
.custom-card button:not(.bg-accent\/20):not(.bg-red-500\/20) {
  color: #1a1a2e !important;
}
.custom-card input::placeholder {
  color: rgba(60, 60, 80, 0.50) !important;
}

.custom-card .bg-accent\/20 {
  color: #d4af37 !important;
}
.custom-card .bg-red-500\/20 {
  color: #f87171 !important;
}

.custom-card .text-white\/40 {
  color: rgba(60, 60, 80, 0.60) !important;
}
.custom-card .text-white {
  color: #1a1a2e !important;
}
.custom-card .text-white\/60 {
  color: rgba(60, 60, 80, 0.70) !important;
}
</style>