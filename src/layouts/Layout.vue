<template>
  <!-- 背景 -->
  <div class="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
       :style="backgroundStyle">
    <!-- 遮罩层：改为 40% 黑色 -->
    <div class="absolute inset-0 bg-black/40 transition-all duration-500"></div>
  </div>

  <!-- 主布局 -->
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
            <i class="fas fa-quote-left mr-2 opacity-40"></i>
            {{ dailyQuote }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <AIAssistant v-if="$route.path !== '/login'" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../stores/user'
import Sidebar from '../components/Sidebar.vue'
import TopBar from '../components/TopBar.vue'
import AIAssistant from '../components/AIAssistant.vue'

const route = useRoute()
const userStore = useUserStore()
const dailyQuote = ref('')
const bgUrl = ref('https://picsum.photos/1920/1080?random=' + Date.now())

const backgroundStyle = computed(() => {
  const pref = userStore.profile?.wallpaper_preference || 'daily'

  if (pref === 'solid') {
    const color = userStore.profile?.wallpaper_color || '#1a1a2e'
    return { backgroundColor: color, backgroundImage: 'none' }
  }

  if (pref === 'fixed') {
    const url = userStore.profile?.wallpaper_url || bgUrl.value
    return { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  }

  return { backgroundImage: `url(${bgUrl.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
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

onMounted(() => {
  loadDailyQuote()
})
</script>

<style scoped>
.daily-quote {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 400;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
}
</style>