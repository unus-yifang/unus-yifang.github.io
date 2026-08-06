<template>
  <div class="profile-container w-full max-w-3xl mx-auto px-4 py-6">

    <!-- ===== 用户信息卡 ===== -->
    <div class="profile-card rounded-2xl p-6 border mb-6">
      <div class="flex items-center gap-5">
        <!-- 头像 -->
        <img
          :src="userStore.avatar"
          alt="avatar"
          class="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
        />
        <!-- 信息 -->
        <div class="flex-1">
          <div class="flex items-center gap-3 flex-wrap">
            <span class="text-2xl font-bold text-gray-800">{{ userStore.username }}</span>
            <span
              class="text-xs px-3 py-1 rounded-full border"
              :class="userStore.subscriptionStatusColor"
            >
              {{ userStore.subscriptionDisplay }}
            </span>
          </div>
          <p class="text-gray-500 text-sm mt-1">{{ userStore.user?.email || '未绑定邮箱' }}</p>
          <div class="flex items-center gap-4 mt-2">
            <div class="flex items-center gap-1.5 text-gray-700 text-sm">
              <i class="fas fa-coins text-accent"></i>
              <span class="font-semibold text-gray-800">{{ userStore.ucoins }}</span>
              <span class="text-gray-400 text-xs">U币</span>
            </div>
            <div v-if="userStore.subscriptionExpiresAt" class="text-gray-500 text-xs">
              到期：{{ formatDate(userStore.subscriptionExpiresAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 订阅状态卡 ===== -->
    <div class="profile-card rounded-2xl p-5 border mb-6">
      <h3 class="text-gray-700 text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
        <i class="fas fa-crown text-accent"></i> 订阅状态
      </h3>
      <div class="flex items-center justify-between">
        <div>
          <div class="text-gray-800 font-medium">
            {{ userStore.effectiveSubscription === 'yearly' ? '🎯 年卡会员' : userStore.effectiveSubscription === 'monthly' ? '📆 月卡会员' : '📖 免费用户' }}
          </div>
          <div class="text-gray-500 text-xs mt-1">
            {{ userStore.effectiveSubscription !== 'free' ? `订阅有效期至 ${formatDate(userStore.subscriptionExpiresAt)}` : '升级会员解锁更多自定义功能' }}
          </div>
        </div>
        <router-link
          to="/support"
          class="px-4 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/30 transition"
        >
          {{ userStore.effectiveSubscription !== 'free' ? '续费' : '升级会员' }}
        </router-link>
      </div>
      <!-- 会员权益 -->
      <div class="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200">
        <div class="text-center">
          <div class="text-gray-500 text-xs">自定义链接</div>
          <div class="text-gray-800 font-medium text-sm">
            {{ userStore.effectiveSubscription === 'yearly' ? '20' : userStore.effectiveSubscription === 'monthly' ? '8' : '3' }}
            个
          </div>
        </div>
        <div class="text-center">
          <div class="text-gray-500 text-xs">每日AI免费</div>
          <div class="text-gray-800 font-medium text-sm">
            {{ userStore.effectiveSubscription === 'yearly' ? '20' : userStore.effectiveSubscription === 'monthly' ? '8' : '3' }}
            次
          </div>
        </div>
        <div class="text-center">
          <div class="text-gray-500 text-xs">自定义装扮</div>
          <div class="text-gray-800 font-medium text-sm">
            {{ userStore.effectiveSubscription !== 'free' ? '✅ 已解锁' : '🔒 未解锁' }}
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 充值/消费记录 ===== -->
    <div class="profile-card rounded-2xl p-5 border">
      <h3 class="text-gray-700 text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
        <i class="fas fa-history text-gray-400"></i> 记录
      </h3>
      <div v-if="records.length === 0" class="text-gray-500 text-sm text-center py-4">
        暂无记录
      </div>
      <div v-else class="space-y-1 max-h-60 overflow-y-auto">
        <div
          v-for="item in records"
          :key="item.id"
          class="flex items-center justify-between text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          <div class="flex items-center gap-3">
            <span class="text-gray-400 text-xs">{{ formatDate(item.created_at) }}</span>
            <span class="text-gray-700">{{ item.type === 'recharge' ? '💰 充值' : '💳 消费' }}</span>
          </div>
          <div>
            <span
              class="font-medium"
              :class="item.type === 'recharge' ? 'text-green-600' : 'text-red-500'"
            >
              {{ item.type === 'recharge' ? '+' : '-' }}{{ item.amount }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 退出登录 ===== -->
    <div class="mt-6 text-center">
      <button
        @click="handleLogout"
        class="text-gray-500 text-sm hover:text-red-500 transition"
      >
        <i class="fas fa-sign-out-alt mr-1"></i> 退出登录
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { supabase } from '../lib/supabase'
import { formatChinaDate } from '../utils/time'

const router = useRouter()
const userStore = useUserStore()

const records = ref([])

function formatDate(dateStr) {
  if (!dateStr) return ''
  return formatChinaDate(dateStr)
}

async function loadRecords() {
  const { data: rechargeData } = await supabase
    .from('recharge_records')
    .select('*')
    .eq('user_id', userStore.user?.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (rechargeData) {
    records.value = rechargeData.map(item => ({
      id: item.id,
      type: 'recharge',
      amount: item.coins,
      created_at: item.created_at,
    }))
  }
}

async function handleLogout() {
  if (confirm('确定退出登录吗？')) {
    await userStore.logout()
    router.push('/')
  }
}

onMounted(() => {
  loadRecords()
})
</script>

<style scoped>
/* ===== 个人卡片（白色毛玻璃 + 深色文字） ===== */
.profile-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-color: rgba(255, 255, 255, 0.40);
}

/* ===== 订阅状态标签（保留原颜色逻辑） ===== */
.text-amber-400 {
  color: #d4af37 !important;
  border-color: rgba(212, 175, 55, 0.30) !important;
  background: rgba(212, 175, 55, 0.10) !important;
}
.text-blue-400 {
  color: #3b82f6 !important;
  border-color: rgba(59, 130, 246, 0.30) !important;
  background: rgba(59, 130, 246, 0.10) !important;
}
.text-white\/40 {
  color: rgba(60, 60, 80, 0.50) !important;
  border-color: rgba(0, 0, 0, 0.08) !important;
  background: rgba(0, 0, 0, 0.04) !important;
}

.max-h-60::-webkit-scrollbar {
  width: 3px;
}
.max-h-60::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
.max-h-60::-webkit-scrollbar-track {
  background: transparent;
}
</style>