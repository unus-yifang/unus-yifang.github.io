<template>
  <div class="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
       :style="backgroundStyle">
    <div class="absolute inset-0 bg-black/20 transition-all duration-500"></div>
  </div>

  <div class="relative z-10 flex h-screen w-screen overflow-hidden">
    <Sidebar />

    <div class="flex-1 h-full overflow-y-auto flex flex-col">
      <TopBar />

      <div class="flex-1 flex flex-col items-center justify-center px-4 pb-4">
        <div class="flex-1 flex items-center justify-center w-full">
          <router-view class="w-full max-w-2xl" />
        </div>

        <div class="flex-shrink-0 w-full text-center py-3">
          <span class="daily-quote">
            <i class="fas fa-quote-left mr-2"></i>
            {{ dailyQuote }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <AIAssistant v-if="$route.path !== '/login'" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../stores/user'
import Sidebar from '../components/Sidebar.vue'
import TopBar from '../components/TopBar.vue'
import AIAssistant from '../components/AIAssistant.vue'

const route = useRoute()
const userStore = useUserStore()
const dailyQuote = ref('')

// ===== 壁纸逻辑 =====
// 只有在 daily 模式下才使用日期种子，fixed/solid 直接使用用户存储的值
const dailyBgUrl = ref('https://picsum.photos/seed/' + getDailySeed() + '/1920/1080')

function getDailySeed() {
  const today = new Date()
  return today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
}

// 每天0点刷新 daily 壁纸
function updateDailyBg() {
  dailyBgUrl.value = 'https://picsum.photos/seed/' + getDailySeed() + '/1920/1080'
}

// 计算下次0点的时间
function getNextMidnight() {
  const now = new Date()
  const next = new Date(now)
  next.setDate(next.getDate() + 1)
  next.setHours(0, 0, 0, 0)
  return next.getTime() - now.getTime()
}

// 设置定时器，每天0点刷新
function scheduleDailyBgUpdate() {
  const delay = getNextMidnight()
  setTimeout(() => {
    updateDailyBg()
    // 之后每天执行
    setInterval(updateDailyBg, 24 * 60 * 60 * 1000)
  }, delay)
}

const backgroundStyle = computed(() => {
  const pref = userStore.profile?.wallpaper_preference || 'daily'

  if (pref === 'solid') {
    const color = userStore.profile?.wallpaper_color || '#1a1a2e'
    return { backgroundColor: color, backgroundImage: 'none' }
  }

  if (pref === 'fixed') {
    const url = userStore.profile?.wallpaper_url
    // 如果用户没有设置固定壁纸，回退到 daily
    if (!url) {
      return { backgroundImage: `url(${dailyBgUrl.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    }
    return { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  }

  // daily 模式
  return { backgroundImage: `url(${dailyBgUrl.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
})

async function loadDailyQuote() {
  try {
    const { data, error } = await supabase
      .from('user_quotes')
      .select('content')
      .eq('status', 'approved')

    if (error) {
      console.error('加载一言失败:', error)
      dailyQuote.value = '加载一言失败'
      return
    }

    if (data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length)
      dailyQuote.value = data[randomIndex].content
    } else {
      dailyQuote.value = '暂无一言，请在管理面板添加'
    }
  } catch (err) {
    console.error('加载一言异常:', err)
    dailyQuote.value = '加载一言异常'
  }
}

// 监听登录状态变化，刷新壁纸
watch(
  () => userStore.isLoggedIn,
  () => {
    // 登录后重新加载壁纸
    updateDailyBg()
  }
)

onMounted(() => {
  loadDailyQuote()
  scheduleDailyBgUpdate()
})
</script>

<style scoped>
.daily-quote {
  font-size: 1rem;
  color: #ffffff;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
.daily-quote .fa-quote-left {
  color: #ffffff;
  opacity: 0.5;
}
</style>