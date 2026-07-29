<template>
  <div class="support-container w-full max-w-3xl mx-auto px-4 py-6">

    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-white drop-shadow-lg tracking-tight">
        支持 <span class="text-accent">Unus · 一方</span>
      </h1>
      <p class="text-white/50 text-sm mt-2">
        你的支持，让一方变得更好 ❤️
      </p>
    </div>

    <!-- ===== 充值档位 ===== -->
    <div class="mb-8">
      <h2 class="support-section-title text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
        <i class="fas fa-coins text-accent"></i> 支持档位
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          v-for="tier in tiers"
          :key="tier.price"
          class="tier-card rounded-xl p-4 border text-center hover:border-accent/40 transition cursor-pointer relative"
          @click="openQRCode(tier)"
        >
          <span
            v-if="tier.tag"
            class="absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
            :class="tier.tagClass"
          >
            {{ tier.tag }}
          </span>
          <div class="tier-price">{{ tier.price }}元</div>
          <div class="tier-coins">{{ tier.coins }} U币</div>
          <div class="tier-label">{{ tier.label }}</div>
          <div v-if="tier.bonus" class="tier-bonus">🎁 加赠 {{ tier.bonus }} 币</div>
        </div>
      </div>
    </div>

    <!-- ===== 推广位购买 ===== -->
    <div class="mb-8">
      <h2 class="support-section-title text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
        <i class="fas fa-bullhorn text-accent"></i> 推广位购买
      </h2>
      <p class="support-sub-text text-xs mb-3">让你的网站出现在首页推荐位，获得更多曝光</p>
      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="promo in promoTiers"
          :key="promo.days"
          class="tier-card rounded-xl p-4 border text-center hover:border-accent/40 transition cursor-pointer"
          @click="openQRCode(promo)"
        >
          <div class="tier-price">{{ promo.days }}天</div>
          <div class="tier-coins text-accent">{{ promo.price }}元</div>
          <div class="tier-label">{{ promo.label }}</div>
        </div>
      </div>
    </div>

    <!-- ===== 兑换码输入 ===== -->
    <div class="mb-8">
      <h2 class="support-section-title text-sm font-medium tracking-wide mb-2 flex items-center gap-2">
        <i class="fas fa-key text-accent"></i> 已有兑换码？
      </h2>
      <div class="flex gap-2">
        <input
          v-model="redeemCode"
          type="text"
          placeholder="输入兑换码..."
          class="support-input flex-1 rounded-lg px-3 py-2 text-sm outline-none"
          @keydown.enter="redeem"
          :disabled="isRedeeming"
        />
        <button
          @click="redeem"
          class="px-4 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/30 transition whitespace-nowrap"
          :disabled="isRedeeming"
        >
          {{ isRedeeming ? '处理中...' : '兑换' }}
        </button>
      </div>
      <p v-if="redeemMsg" class="text-xs mt-2" :class="redeemMsgType === 'ok' ? 'text-green-400' : 'text-red-400'">{{ redeemMsg }}</p>
    </div>

    <!-- ===== 会员订阅 ===== -->
    <div class="mb-8">
      <h2 class="support-section-title text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
        <i class="fas fa-crown text-accent"></i> 会员订阅
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <!-- 月卡 -->
        <div class="member-card rounded-xl p-5 border hover:border-blue-400/40 transition relative">
          <span v-if="userStore.effectiveSubscription === 'monthly'" class="absolute -top-2 -left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
            ✅ 当前订阅
          </span>
          <div class="flex items-center justify-between mb-2">
            <span class="member-title">📆 月卡</span>
            <span class="member-price">68 U币</span>
          </div>
          <div class="member-features text-xs space-y-1">
            <div class="flex items-center gap-2"><span class="text-green-400">✅</span> 自定义链接上限 8 个</div>
            <div class="flex items-center gap-2"><span class="text-green-400">✅</span> 每日 AI 免费 8 次</div>
            <div class="flex items-center gap-2"><span class="text-green-400">✅</span> 自定义壁纸 / 主题色</div>
            <div class="flex items-center gap-2 text-white/50"><span>❌</span> 新功能优先体验</div>
          </div>
          <button
            v-if="userStore.effectiveSubscription !== 'monthly'"
            @click="buyMonthly"
            class="mt-4 w-full py-2 rounded-lg bg-blue-400/20 border border-blue-400/30 text-blue-400 text-sm font-medium hover:bg-blue-400/30 transition"
          >
            立即订阅（68 U币/月）
          </button>
          <button
            v-else
            disabled
            class="mt-4 w-full py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium cursor-default"
          >
            ✅ 已订阅
          </button>
        </div>

        <!-- 年卡 -->
        <div class="member-card rounded-xl p-5 border hover:border-amber-400/60 transition relative">
          <span v-if="userStore.effectiveSubscription === 'yearly'" class="absolute -top-2 -left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
            ✅ 当前订阅
          </span>
          <span class="absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
            -20%
          </span>
          <div class="flex items-center justify-between mb-2">
            <span class="member-title">✨ 年卡</span>
            <span class="member-price text-amber-400">648 U币</span>
          </div>
          <div class="member-features text-xs space-y-1">
            <div class="flex items-center gap-2"><span class="text-green-400">✅</span> 自定义链接上限 20 个</div>
            <div class="flex items-center gap-2"><span class="text-green-400">✅</span> 每日 AI 免费 20 次</div>
            <div class="flex items-center gap-2"><span class="text-green-400">✅</span> 自定义壁纸 / 主题色</div>
            <div class="flex items-center gap-2"><span class="text-green-400">✅</span> 新功能优先体验</div>
          </div>
          <button
            v-if="userStore.effectiveSubscription !== 'yearly'"
            @click="buyYearly"
            class="mt-4 w-full py-2 rounded-lg bg-amber-400/20 border border-amber-400/30 text-amber-400 text-sm font-medium hover:bg-amber-400/30 transition"
          >
            立即订阅（648 U币/年）
          </button>
          <button
            v-else
            disabled
            class="mt-4 w-full py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium cursor-default"
          >
            ✅ 已订阅
          </button>
        </div>
      </div>
      <p v-if="subMsg" class="text-xs mt-2" :class="subMsgType === 'ok' ? 'text-green-400' : 'text-red-400'">{{ subMsg }}</p>
    </div>

    <!-- ===== 感谢名单 ===== -->
    <div>
      <h2 class="support-section-title text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
        <i class="fas fa-heart text-red-400"></i> 感谢支持者（{{ thanksList.length }} 人）
      </h2>
      <div class="thanks-card rounded-xl p-4 border">
        <div v-if="thanksList.length === 0" class="text-gray-700 text-sm text-center py-4">
          还没有支持者，成为第一个吧 🎉
        </div>
        <div v-else class="space-y-1 max-h-80 overflow-y-auto">
          <div
            v-for="item in thanksList"
            :key="item.id"
            class="flex items-center gap-2 text-sm px-2 py-1.5 rounded hover:bg-white/5 transition thanks-item"
          >
            <span class="text-green-400 text-xs">●</span>
            <span class="thanks-username">{{ item.username }}</span>
            <span class="thanks-amount">+{{ item.amount }}元</span>
            <span class="thanks-date">{{ formatDate(item.created_at) }}</span>
          </div>
        </div>
        <!-- ===== 底部文案改为黑色 ===== -->
        <div class="text-center text-gray-500 text-[10px] mt-3">
          —— 感谢每一位让 Unus · 一方变得更好的人 ——
        </div>
      </div>
    </div>

    <!-- ===== 微信二维码模态框 ===== -->
    <div v-if="qrModalVisible" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="qrModalVisible = false">
      <div class="glass dark:glass-dark rounded-2xl border border-white/20 p-6 w-full max-w-sm shadow-2xl text-center">
        <div class="text-white font-medium mb-3">扫码联系站长</div>
        <img
          :src="qrImageUrl"
          alt="微信二维码"
          class="w-full rounded-lg"
          @error="handleQrError"
        />
        <div class="text-white/40 text-xs mt-3">
          <div v-if="selectedItem?.coins">
            档位：<span class="text-white">{{ selectedItem?.price }}元 — {{ selectedItem?.coins }} U币</span>
            <span v-if="selectedItem?.bonus" class="text-accent"> 🎁 加赠 {{ selectedItem.bonus }} 币</span>
          </div>
          <div v-else-if="selectedItem?.days">
            推广位：<span class="text-white">{{ selectedItem?.days }}天 — {{ selectedItem?.price }}元</span>
          </div>
        </div>
        <button @click="qrModalVisible = false" class="mt-4 px-6 py-2 rounded-lg bg-white/10 border border-white/10 text-white/70 hover:bg-white/20 transition">关闭</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const thanksList = ref([])
const redeemCode = ref('')
const redeemMsg = ref('')
const redeemMsgType = ref('ok')
const isRedeeming = ref(false)

const qrModalVisible = ref(false)
const selectedItem = ref(null)
const qrImageUrl = ref('https://cdn.luogu.com.cn/upload/image_hosting/l26vwta6.png')

const subMsg = ref('')
const subMsgType = ref('ok')

const tiers = [
  { price: 6, coins: 60, label: '体验包', bonus: 0, tag: null, tagClass: '' },
  { price: 12, coins: 132, label: '标准包', bonus: 12, tag: '+10%', tagClass: 'bg-blue-500' },
  { price: 30, coins: 375, label: '尊享包', bonus: 75, tag: '+25%', tagClass: 'bg-purple-500' },
  { price: 60, coins: 900, label: '旗舰包', bonus: 300, tag: '+50% 🔥', tagClass: 'bg-accent' },
]

const promoTiers = [
  { days: 7, price: '7.9', label: '体验推广' },
  { days: 30, price: '29.9', label: '标准推广' },
  { days: 365, price: '298', label: '长期推广' },
]

async function loadThanksList() {
  const { data, error } = await supabase.from('recharge_records').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(100)
  if (!error && data) thanksList.value = data
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function openQRCode(item) {
  selectedItem.value = item
  qrModalVisible.value = true
}

function handleQrError() {
  qrImageUrl.value = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=weixin'
}

async function buyMonthly() {
  if (!userStore.isLoggedIn) { subMsg.value = '⚠️ 请先登录'; subMsgType.value = 'err'; return }
  try {
    await userStore.subscribeMonthly()
    await userStore.fetchProfile()
    alert('🎉 恭喜你成为 Unus · 一方 月卡会员！\n\n✨ 自定义链接上限提升至 8 个\n✨ 每日 AI 免费次数提升至 8 次\n✨ 自定义壁纸 / 主题色已解锁\n\n感谢你的支持，让一方变得更好 ❤️')
    subMsg.value = '✅ 月卡订阅成功！'
    subMsgType.value = 'ok'
  } catch (err) {
    subMsg.value = '❌ ' + err.message
    subMsgType.value = 'err'
  }
  setTimeout(() => { subMsg.value = '' }, 3000)
}

async function buyYearly() {
  if (!userStore.isLoggedIn) { subMsg.value = '⚠️ 请先登录'; subMsgType.value = 'err'; return }
  try {
    await userStore.subscribeYearly()
    await userStore.fetchProfile()
    alert('🎉🎉🎉 恭喜你成为 Unus · 一方 年卡会员！\n\n✨ 自定义链接上限提升至 20 个\n✨ 每日 AI 免费次数提升至 20 次\n✨ 自定义壁纸 / 主题色已解锁\n✨ 新功能优先体验权已开启\n\n你是我们最重要的支持者！感谢你让一方变得更好 ❤️')
    subMsg.value = '✅ 年卡订阅成功！'
    subMsgType.value = 'ok'
  } catch (err) {
    subMsg.value = '❌ ' + err.message
    subMsgType.value = 'err'
  }
  setTimeout(() => { subMsg.value = '' }, 3000)
}

async function redeem() {
  const code = redeemCode.value.trim()
  if (!code) { redeemMsg.value = '⚠️ 请输入兑换码'; redeemMsgType.value = 'err'; return }
  if (!userStore.isLoggedIn) { redeemMsg.value = '⚠️ 请先登录'; redeemMsgType.value = 'err'; return }

  isRedeeming.value = true
  redeemMsg.value = ''

  try {
    const { data: codeData, error: codeError } = await supabase.from('redeem_codes').select('*').eq('code', code).eq('used', false).single()
    if (codeError || !codeData) { redeemMsg.value = '❌ 无效或已使用的兑换码'; redeemMsgType.value = 'err'; isRedeeming.value = false; return }

    const newCoins = userStore.ucoins + codeData.coins
    const { error: updateError } = await supabase.from('profiles').update({ ucoins: newCoins }).eq('id', userStore.user.id)
    if (updateError) { redeemMsg.value = '❌ ' + updateError.message; redeemMsgType.value = 'err'; isRedeeming.value = false; return }

    await supabase.from('redeem_codes').update({ used: true, used_by: userStore.user.id, used_at: new Date().toISOString() }).eq('id', codeData.id)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    await supabase.from('recharge_records').insert({
      user_id: userStore.user.id, username: userStore.username, email: userStore.user.email,
      amount: parseInt(codeData.tier), coins: codeData.coins,
      created_at: new Date().toISOString(), expires_at: expiresAt.toISOString(), status: 'active'
    })

    await userStore.fetchProfile()
    await loadThanksList()

    redeemMsg.value = `✅ 兑换成功！获得 ${codeData.coins} U币`
    redeemMsgType.value = 'ok'
    redeemCode.value = ''

  } catch (err) {
    redeemMsg.value = '❌ ' + err.message
    redeemMsgType.value = 'err'
  }

  isRedeeming.value = false
  setTimeout(() => { redeemMsg.value = '' }, 5000)
}

onMounted(() => {
  loadThanksList()
})
</script>

<style scoped>
.support-section-title {
  color: #1a1a2e !important;
}
.support-section-title .text-accent {
  color: #d4af37 !important;
}

.support-sub-text {
  color: rgba(60, 60, 80, 0.60) !important;
}

.support-input {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.40);
  color: #1a1a2e;
}
.support-input::placeholder {
  color: rgba(60, 60, 80, 0.50);
}
.support-input:focus {
  border-color: #d4af37;
  outline: none;
}

.tier-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-color: rgba(255, 255, 255, 0.30);
}
.tier-card:hover {
  border-color: rgba(212, 175, 55, 0.50);
}

.tier-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
}
.tier-coins {
  color: rgba(60, 60, 80, 0.70);
  font-size: 0.875rem;
  margin-top: 4px;
}
.tier-label {
  color: rgba(60, 60, 80, 0.50);
  font-size: 0.65rem;
  margin-top: 4px;
}
.tier-bonus {
  color: #d4af37;
  font-size: 0.65rem;
  margin-top: 2px;
}

.member-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-color: rgba(255, 255, 255, 0.30);
}

.member-title {
  font-weight: 700;
  font-size: 1.125rem;
  color: #1a1a2e;
}
.member-price {
  color: rgba(60, 60, 80, 0.50);
  font-size: 0.875rem;
}

.member-features {
  color: rgba(60, 60, 80, 0.70);
}

.thanks-card {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-color: rgba(255, 255, 255, 0.30);
}
.thanks-item {
  background: rgba(255, 255, 255, 0.20);
}
.thanks-item:hover {
  background: rgba(255, 255, 255, 0.40);
}
.thanks-username {
  color: #1a1a2e;
}
.thanks-amount {
  color: #d4af37;
}
.thanks-date {
  color: rgba(60, 60, 80, 0.40);
  font-size: 0.65rem;
  margin-left: auto;
}

.max-h-80::-webkit-scrollbar {
  width: 3px;
}
.max-h-80::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}
.max-h-80::-webkit-scrollbar-track {
  background: transparent;
}
</style>