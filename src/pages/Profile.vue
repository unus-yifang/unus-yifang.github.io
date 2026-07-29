<template>
  <div class="profile-container w-full max-w-3xl mx-auto px-4 py-6">

    <!-- ===== 用户信息卡 ===== -->
    <div class="glass dark:glass-dark rounded-2xl p-6 border border-white/10 mb-6">
      <div class="flex items-center gap-5">
        <!-- 头像 -->
        <img
          :src="userStore.avatar"
          alt="avatar"
          class="w-20 h-20 rounded-full object-cover border-2 border-white/20"
        />
        <!-- 信息 -->
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <span class="text-2xl font-bold text-white">{{ userStore.username }}</span>
            <span
              class="text-xs px-3 py-1 rounded-full border"
              :class="userStore.subscriptionStatusColor"
            >
              {{ userStore.subscriptionDisplay }}
            </span>
          </div>
          <p class="text-white/50 text-sm mt-1">{{ userStore.user?.email || '未绑定邮箱' }}</p>
          <div class="flex items-center gap-4 mt-2">
            <div class="flex items-center gap-1.5 text-white/80 text-sm">
              <i class="fas fa-coins text-accent"></i>
              <span class="font-semibold text-white">{{ userStore.ucoins }}</span>
              <span class="text-white/40 text-xs">U币</span>
            </div>
            <div v-if="userStore.subscriptionExpiresAt" class="text-white/50 text-xs">
              到期：{{ formatDate(userStore.subscriptionExpiresAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 订阅状态卡 ===== -->
    <div class="glass dark:glass-dark rounded-2xl p-5 border border-white/10 mb-6">
      <h3 class="text-white/80 text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
        <i class="fas fa-crown text-accent"></i> 订阅状态
      </h3>
      <div class="flex items-center justify-between">
        <div>
          <div class="text-white font-medium">
            {{ userStore.effectiveSubscription === 'yearly' ? '🎯 年卡会员' : userStore.effectiveSubscription === 'monthly' ? '📆 月卡会员' : '📖 免费用户' }}
          </div>
          <div class="text-white/50 text-xs mt-1">
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
      <div class="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
        <div class="text-center">
          <div class="text-white/60 text-xs">自定义链接</div>
          <div class="text-white font-medium text-sm">
            {{ userStore.effectiveSubscription === 'yearly' ? '20' : userStore.effectiveSubscription === 'monthly' ? '8' : '3' }}
            个
          </div>
        </div>
        <div class="text-center">
          <div class="text-white/60 text-xs">每日AI免费</div>
          <div class="text-white font-medium text-sm">
            {{ userStore.effectiveSubscription === 'yearly' ? '20' : userStore.effectiveSubscription === 'monthly' ? '8' : '3' }}
            次
          </div>
        </div>
        <div class="text-center">
          <div class="text-white/60 text-xs">自定义装扮</div>
          <div class="text-white font-medium text-sm">
            {{ userStore.effectiveSubscription !== 'free' ? '✅ 已解锁' : '🔒 未解锁' }}
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 充值/消费记录 ===== -->
    <div class="glass dark:glass-dark rounded-2xl p-5 border border-white/10">
      <h3 class="text-white/80 text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
        <i class="fas fa-history text-white/50"></i> 记录
      </h3>
      <div v-if="records.length === 0" class="text-white/50 text-sm text-center py-4">
        暂无记录
      </div>
      <div v-else class="space-y-1 max-h-60 overflow-y-auto">
        <div
          v-for="item in records"
          :key="item.id"
          class="flex items-center justify-between text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition"
        >
          <div class="flex items-center gap-3">
            <span class="text-white/50 text-xs">{{ formatDate(item.created_at) }}</span>
            <span class="text-white/80">{{ item.type === 'recharge' ? '💰 充值' : '💳 消费' }}</span>
          </div>
          <div>
            <span
              class="font-medium"
              :class="item.type === 'recharge' ? 'text-green-400' : 'text-red-400'"
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
        class="text-white/80 text-sm hover:text-red-400 transition"
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

const router = useRouter()
const userStore = useUserStore()

const records = ref([])

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
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
.max-h-60::-webkit-scrollbar {
  width: 3px;
}
.max-h-60::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}
.max-h-60::-webkit-scrollbar-track {
  background: transparent;
}
</style>