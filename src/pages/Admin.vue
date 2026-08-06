<template>
  <div class="admin-container w-full max-w-3xl mx-auto px-4 py-6">

    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">🛠️ 管理面板</h1>
      <p class="text-white/40 text-sm mt-2">所有操作实时生效</p>
    </div>

    <div class="admin-card rounded-xl p-5 border mb-6">
      <h2 class="card-title text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
        <i class="fas fa-ticket-alt text-accent"></i> 兑换码管理
      </h2>
      <div class="flex gap-2">
        <select v-model="codeTier" class="card-select flex-1 rounded-lg px-3 py-2 text-sm outline-none">
          <option value="10">1元 — 10币</option>
          <option value="60">6元 — 80币</option>
          <option value="99">9.9元 — 128币</option>
          <option value="299">29.9元 — 648币</option>
        </select>
        <button @click="generateCode" class="px-4 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/30 transition">生成</button>
      </div>
      <div v-if="generatedCode" class="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 code-box">
        <code class="text-accent text-sm font-mono flex-1">{{ generatedCode }}</code>
        <button @click="copyCode" class="text-gray-600 hover:text-gray-900 text-xs">📋 复制</button>
        <button @click="generatedCode = ''" class="text-white/30 hover:text-white/60 text-xs">✕</button>
      </div>
      <p v-if="codeMsg" class="text-xs mt-2" :class="codeMsgType === 'ok' ? 'text-green-400' : 'text-red-400'">{{ codeMsg }}</p>

      <div v-if="codeList.length > 0" class="mt-4 border-t border-white/10 pt-4">
        <h3 class="text-xs text-gray-500 font-medium tracking-wide mb-2">已生成的兑换码</h3>
        <div class="max-h-40 overflow-y-auto space-y-1">
          <div
            v-for="item in codeList"
            :key="item.id"
            class="flex items-center justify-between text-xs px-2 py-1.5 rounded hover:bg-gray-100 transition"
          >
            <span class="font-mono text-gray-800">{{ item.code }}</span>
            <span class="text-gray-600">{{ item.coins }}币</span>
            <span class="text-gray-400 text-[10px]">{{ formatChinaDate(item.created_at) }}</span>
            <span :class="item.used ? 'text-red-500' : 'text-green-600'">
              {{ item.used ? '已使用' : '未使用' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 一言管理 ===== -->
    <div class="admin-card rounded-xl p-5 border mb-6">
      <h2 class="card-title text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
        <i class="fas fa-quote-left text-accent"></i> 一言管理（共 {{ quotes.length }} 条）
      </h2>

      <div class="flex gap-2 mb-3">
        <input
          v-model="newQuote"
          type="text"
          placeholder="输入新一言..."
          class="card-input flex-1 rounded-lg px-3 py-2 text-sm outline-none"
          @keydown.enter="addQuote"
        />
        <button @click="addQuote" class="px-4 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/30 transition whitespace-nowrap">
          添加
        </button>
      </div>

      <div class="max-h-64 overflow-y-auto space-y-1">
        <div
          v-for="q in quotes"
          :key="q.id"
          class="flex items-center justify-between rounded-lg px-3 py-2 text-sm group quote-item"
        >
          <span class="quote-content truncate flex-1 mr-2">{{ q.content }}</span>
          <span class="text-white/30 text-[10px] mr-2">{{ q.id ? q.id.substring(0, 8) : '' }}</span>
          <div class="flex gap-1 flex-shrink-0">
            <button @click="openEditModal(q)" class="text-white/40 hover:text-white text-xs transition px-1">✎</button>
            <button @click="deleteQuote(q.id)" class="text-red-400/60 hover:text-red-400 text-xs transition px-1">✕</button>
          </div>
        </div>
        <div v-if="quotes.length === 0" class="text-gray-500 text-xs text-center py-4">暂无一言</div>
      </div>

      <p v-if="quoteMsg" class="text-xs mt-2" :class="quoteMsgType === 'ok' ? 'text-green-400' : 'text-red-400'">{{ quoteMsg }}</p>
    </div>

    <!-- ===== 推荐位 ===== -->
    <div class="admin-card rounded-xl p-5 border">
      <h2 class="card-title text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
        <i class="fas fa-fire text-accent"></i> 推荐位管理（共 {{ promos.length }} 个）
      </h2>
      <div class="space-y-2">
        <input v-model="promoTitle" type="text" placeholder="标题" class="card-input w-full rounded-lg px-3 py-2 text-sm outline-none" />
        <input v-model="promoUrl" type="text" placeholder="链接" class="card-input w-full rounded-lg px-3 py-2 text-sm outline-none" />
        <div class="flex gap-2">
          <select v-model="promoDays" class="card-select flex-1 rounded-lg px-3 py-2 text-sm outline-none">
            <option :value="7">7天</option>
            <option :value="30">30天</option>
            <option :value="365">365天</option>
          </select>
          <button @click="addPromo" class="px-4 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/30 transition">添加</button>
        </div>
      </div>
      <div class="mt-3 max-h-40 overflow-y-auto space-y-1">
        <div v-for="p in promos" :key="p.id" class="flex items-center justify-between rounded-lg px-3 py-1.5 text-sm group promo-item">
          <span class="promo-title truncate flex-1">{{ p.title }}</span>
          <span class="text-white/30 text-xs mr-2">{{ p.remaining }}d</span>
          <button @click="removePromo(p.id)" class="text-red-400/60 hover:text-red-400 text-xs transition opacity-0 group-hover:opacity-100">下架</button>
        </div>
        <div v-if="promos.length === 0" class="text-gray-500 text-xs text-center py-3">暂无推荐位</div>
      </div>
      <p v-if="promoMsg" class="text-xs mt-2" :class="promoMsgType === 'ok' ? 'text-green-400' : 'text-red-400'">{{ promoMsg }}</p>
    </div>

    <!-- ===== 编辑一言模态框（白色毛玻璃 + 黑色文字） ===== -->
    <div v-if="editModalVisible" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="editModalVisible = false">
      <div class="modal-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 class="text-gray-800 text-lg font-semibold mb-3 flex items-center gap-2">
          <i class="fas fa-pen text-accent"></i> 编辑一言
        </h3>
        <input
          v-model="editQuoteContent"
          type="text"
          placeholder="修改内容..."
          class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm placeholder-gray-400 outline-none focus:border-accent/50 transition"
          @keydown.enter="confirmEditQuote"
        />
        <div class="flex gap-3 mt-4">
          <button @click="confirmEditQuote" class="flex-1 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent font-medium hover:bg-accent/30 transition">
            保存
          </button>
          <button @click="editModalVisible = false" class="flex-1 py-2 rounded-lg bg-gray-200 border border-gray-300 text-gray-700 font-medium hover:bg-gray-300 transition">
            取消
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { formatChinaDate } from '../utils/time'

// ===== 状态 =====
const codeTier = ref('10')
const generatedCode = ref('')
const codeMsg = ref('')
const codeMsgType = ref('ok')
const codeList = ref([])

const newQuote = ref('')
const quotes = ref([])
const quoteMsg = ref('')
const quoteMsgType = ref('ok')
const editModalVisible = ref(false)
const editQuoteId = ref('')
const editQuoteContent = ref('')

const promoTitle = ref('')
const promoUrl = ref('')
const promoDays = ref(7)
const promos = ref([])
const promoMsg = ref('')
const promoMsgType = ref('ok')

// ===== 兑换码 =====
// tierMap 键为乘以10后的值
const tierMap = { 10: 10, 60: 80, 99: 128, 299: 648 }

async function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let random = ''
  for (let i = 0; i < 8; i++) random += chars[Math.floor(Math.random() * chars.length)]
  const code = `U${codeTier.value}-${random}`

  const { error } = await supabase.from('redeem_codes').insert({
    code,
    tier: parseInt(codeTier.value),
    coins: tierMap[codeTier.value],
    used: false,
    created_at: new Date().toISOString(),
  })

  if (error) { codeMsg.value = '❌ ' + error.message; codeMsgType.value = 'err'; return }

  generatedCode.value = code
  codeMsg.value = '✅ 已生成'
  codeMsgType.value = 'ok'
  await loadCodeList()
  setTimeout(() => { codeMsg.value = '' }, 3000)
}

function copyCode() {
  navigator.clipboard?.writeText(generatedCode.value)
  codeMsg.value = '✅ 已复制'
  codeMsgType.value = 'ok'
  setTimeout(() => { codeMsg.value = '' }, 2000)
}

async function loadCodeList() {
  const { data, error } = await supabase
    .from('redeem_codes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  if (!error && data) {
    codeList.value = data
  }
}

// ===== 一言管理 =====
async function loadQuotes() {
  quotes.value = []
  try {
    const { data, error } = await supabase
      .from('user_quotes')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(1000)
    if (error) { console.error('加载一言失败:', error); return }
    quotes.value = data || []
  } catch (err) { console.error('加载一言异常:', err) }
}

async function addQuote() {
  const content = newQuote.value.trim()
  if (!content) { quoteMsg.value = '⚠️ 请输入内容'; quoteMsgType.value = 'err'; return }

  const { data: user } = await supabase.auth.getUser()
  const userId = user?.user?.id || null

  const { error } = await supabase.from('user_quotes').insert({
    user_id: userId,
    username: '管理员',
    content,
    recharge_amount: 0,
    status: 'approved',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
  })

  if (error) { quoteMsg.value = '❌ ' + error.message; quoteMsgType.value = 'err'; return }

  quoteMsg.value = '✅ 已添加'
  quoteMsgType.value = 'ok'
  newQuote.value = ''
  await loadQuotes()
  setTimeout(() => { quoteMsg.value = '' }, 2000)
}

function openEditModal(q) {
  editQuoteId.value = q.id
  editQuoteContent.value = q.content
  editModalVisible.value = true
}

async function confirmEditQuote() {
  const content = editQuoteContent.value.trim()
  if (!content) { quoteMsg.value = '⚠️ 内容不能为空'; quoteMsgType.value = 'err'; return }

  const { error } = await supabase.from('user_quotes').update({ content }).eq('id', editQuoteId.value)
  editModalVisible.value = false

  if (error) { quoteMsg.value = '❌ ' + error.message; quoteMsgType.value = 'err'; return }

  quoteMsg.value = '✅ 已修改'
  quoteMsgType.value = 'ok'
  await loadQuotes()
  setTimeout(() => { quoteMsg.value = '' }, 2000)
}

async function deleteQuote(id) {
  if (!confirm('确定删除这条一言吗？')) return
  const { error } = await supabase.from('user_quotes').delete().eq('id', id)
  if (error) { quoteMsg.value = '❌ ' + error.message; quoteMsgType.value = 'err' } else {
    await loadQuotes()
    quoteMsg.value = '✅ 已删除'
    quoteMsgType.value = 'ok'
  }
  setTimeout(() => { quoteMsg.value = '' }, 2000)
}

// ===== 推荐位管理 =====
async function loadPromos() {
  promos.value = []
  try {
    const { data, error } = await supabase.from('promotions').select('*').eq('status', 'active').order('expires_at', { ascending: true })
    if (error) { console.error('加载推荐位失败:', error); return }
    if (data) {
      promos.value = data.map(p => ({ ...p, remaining: Math.max(0, Math.ceil((new Date(p.expires_at) - new Date()) / (1000 * 60 * 60 * 24))) }))
    }
  } catch (err) { console.error('加载推荐位异常:', err) }
}

async function addPromo() {
  const title = promoTitle.value.trim()
  const url = promoUrl.value.trim()
  if (!title || !url) { promoMsg.value = '⚠️ 请填写标题和链接'; promoMsgType.value = 'err'; return }

  let finalUrl = url
  if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) finalUrl = 'https://' + finalUrl

  const priceMap = { 7: 7, 30: 19.9, 365: 128 }
  const expires = new Date()
  expires.setDate(expires.getDate() + promoDays.value)

  const { error } = await supabase.from('promotions').insert({
    title, url: finalUrl, duration_days: promoDays.value,
    price: priceMap[promoDays.value], status: 'active',
    expires_at: expires.toISOString(), created_at: new Date().toISOString(),
  })

  if (error) { promoMsg.value = '❌ ' + error.message; promoMsgType.value = 'err'; return }

  promoMsg.value = '✅ 已添加'
  promoMsgType.value = 'ok'
  promoTitle.value = ''
  promoUrl.value = ''
  await loadPromos()
  setTimeout(() => { promoMsg.value = '' }, 2000)
}

async function removePromo(id) {
  if (!confirm('确定下架吗？')) return
  const { error } = await supabase.from('promotions').update({ status: 'expired' }).eq('id', id)
  if (error) { promoMsg.value = '❌ ' + error.message; promoMsgType.value = 'err' } else {
    await loadPromos()
    promoMsg.value = '✅ 已下架'
    promoMsgType.value = 'ok'
  }
  setTimeout(() => { promoMsg.value = '' }, 2000)
}

// ===== 生命周期 =====
onMounted(() => {
  loadQuotes()
  loadPromos()
  loadCodeList()
})
</script>

<style scoped>
.admin-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-color: rgba(255, 255, 255, 0.30);
}
.card-title { color: #1a1a2e !important; }
.card-title .text-accent { color: #d4af37 !important; }
.card-input {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.40);
  color: #1a1a2e;
}
.card-input::placeholder { color: rgba(60, 60, 80, 0.50); }
.card-input:focus { border-color: #d4af37; outline: none; }
.card-select {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.40);
  color: #1a1a2e;
}
.card-select:focus { border-color: #d4af37; outline: none; }
.code-box { background: rgba(255, 255, 255, 0.50); }
.quote-item { background: rgba(255, 255, 255, 0.30); }
.quote-item:hover { background: rgba(255, 255, 255, 0.50); }
.quote-content { color: #1a1a2e; }
.promo-item { background: rgba(255, 255, 255, 0.30); }
.promo-item:hover { background: rgba(255, 255, 255, 0.50); }
.promo-title { color: #1a1a2e; }

.modal-white {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.50);
}

.max-h-64::-webkit-scrollbar, .max-h-40::-webkit-scrollbar { width: 3px; }
.max-h-64::-webkit-scrollbar-thumb, .max-h-40::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); border-radius: 4px; }
.max-h-64::-webkit-scrollbar-track, .max-h-40::-webkit-scrollbar-track { background: transparent; }
</style>