<template>
  <div class="admin-container w-full max-w-3xl mx-auto px-4 py-6">

    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">🛠️ 管理面板</h1>
      <p class="text-white/40 text-sm mt-2">所有操作实时生效</p>
    </div>

    <!-- ===== 卡片1：兑换码 ===== -->
    <div class="glass dark:glass-dark rounded-xl p-5 border border-white/10 mb-6">
      <h2 class="text-white/80 text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
        <i class="fas fa-ticket-alt text-accent"></i> 兑换码管理
      </h2>
      <div class="flex gap-2">
        <select v-model="codeTier" class="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-accent/50">
          <option value="6">6元 — 60币</option>
          <option value="12">12元 — 132币</option>
          <option value="30">30元 — 375币</option>
          <option value="60">60元 — 900币 + 9折券</option>
        </select>
        <button @click="generateCode" class="px-4 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/30 transition">生成</button>
      </div>
      <div v-if="generatedCode" class="mt-3 flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
        <code class="text-accent text-sm font-mono flex-1">{{ generatedCode }}</code>
        <button @click="copyCode" class="text-white/60 hover:text-white text-xs">📋 复制</button>
        <button @click="generatedCode = ''" class="text-white/30 hover:text-white/60 text-xs">✕</button>
      </div>
      <p v-if="codeMsg" class="text-xs mt-2" :class="codeMsgType === 'ok' ? 'text-green-400' : 'text-red-400'">{{ codeMsg }}</p>
    </div>

    <!-- ===== 卡片2：一言管理 ===== -->
    <div class="glass dark:glass-dark rounded-xl p-5 border border-white/10 mb-6">
      <h2 class="text-white/80 text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
        <i class="fas fa-quote-left text-accent"></i> 一言管理（共 {{ quotes.length }} 条）
      </h2>

      <div class="flex gap-2 mb-3">
        <input
          v-model="newQuote"
          type="text"
          placeholder="输入新一言..."
          class="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 outline-none focus:border-accent/50"
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
          class="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-sm group hover:bg-white/10 transition"
        >
          <span class="text-white/80 truncate flex-1 mr-2">{{ q.content }}</span>
          <span class="text-white/30 text-[10px] mr-2">{{ q.id ? q.id.substring(0, 8) : '' }}</span>
          <div class="flex gap-1 flex-shrink-0">
            <button @click="openEditModal(q)" class="text-white/40 hover:text-white text-xs transition px-1">✎</button>
            <button @click="deleteQuote(q.id)" class="text-red-400/60 hover:text-red-400 text-xs transition px-1">✕</button>
          </div>
        </div>
        <div v-if="quotes.length === 0" class="text-white/30 text-xs text-center py-4">暂无一言</div>
      </div>

      <p v-if="quoteMsg" class="text-xs mt-2" :class="quoteMsgType === 'ok' ? 'text-green-400' : 'text-red-400'">{{ quoteMsg }}</p>
    </div>

    <!-- ===== 卡片3：推荐位（修复版） ===== -->
    <div class="glass dark:glass-dark rounded-xl p-5 border border-white/10">
      <h2 class="text-white/80 text-sm font-medium tracking-wide mb-3 flex items-center gap-2">
        <i class="fas fa-fire text-accent"></i> 推荐位管理（共 {{ promos.length }} 个）
      </h2>
      <div class="space-y-2">
        <input v-model="promoTitle" type="text" placeholder="标题" class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 outline-none focus:border-accent/50" />
        <input v-model="promoUrl" type="text" placeholder="链接" class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 outline-none focus:border-accent/50" />
        <div class="flex gap-2">
          <select v-model="promoDays" class="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-accent/50">
            <option :value="7">7天</option>
            <option :value="30">30天</option>
            <option :value="365">365天</option>
          </select>
          <button @click="addPromo" class="px-4 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/30 transition">添加</button>
        </div>
      </div>
      <div class="mt-3 max-h-40 overflow-y-auto space-y-1">
        <div v-for="p in promos" :key="p.id" class="flex items-center justify-between bg-white/5 rounded-lg px-3 py-1.5 text-sm group">
          <span class="text-white/70 truncate flex-1">{{ p.title }}</span>
          <span class="text-white/30 text-xs mr-2">{{ p.remaining }}d</span>
          <button @click="removePromo(p.id)" class="text-red-400/60 hover:text-red-400 text-xs transition opacity-0 group-hover:opacity-100">下架</button>
        </div>
        <div v-if="promos.length === 0" class="text-white/30 text-xs text-center py-3">暂无推荐位</div>
      </div>
      <p v-if="promoMsg" class="text-xs mt-2" :class="promoMsgType === 'ok' ? 'text-green-400' : 'text-red-400'">{{ promoMsg }}</p>
    </div>

    <!-- ===== 编辑一言模态框 ===== -->
    <div v-if="editModalVisible" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="editModalVisible = false">
      <div class="glass dark:glass-dark rounded-2xl border border-white/20 p-6 w-full max-w-md shadow-2xl">
        <h3 class="text-white text-lg font-semibold mb-3 flex items-center gap-2">
          <i class="fas fa-pen text-accent"></i> 编辑一言
        </h3>
        <input
          v-model="editQuoteContent"
          type="text"
          placeholder="修改内容..."
          class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 outline-none focus:border-accent/50"
          @keydown.enter="confirmEditQuote"
        />
        <div class="flex gap-3 mt-4">
          <button @click="confirmEditQuote" class="flex-1 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent font-medium hover:bg-accent/30 transition">保存</button>
          <button @click="editModalVisible = false" class="flex-1 py-2 rounded-lg bg-white/10 border border-white/10 text-white/70 hover:bg-white/20 transition">取消</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

// ============================================================
// 状态
// ============================================================
const codeTier = ref('6')
const generatedCode = ref('')
const codeMsg = ref('')
const codeMsgType = ref('ok')

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

// ============================================================
// 兑换码
// ============================================================
async function generateCode() {
  const tierMap = { 6: 60, 12: 132, 30: 375, 60: 900 }
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let random = ''
  for (let i = 0; i < 8; i++) random += chars[Math.floor(Math.random() * chars.length)]
  const code = `U${codeTier.value}-${random}`

  const { error } = await supabase.from('redeem_codes').insert({
    code,
    tier: codeTier.value,
    coins: tierMap[codeTier.value],
    discount_quota: codeTier.value === '60' ? 1 : 0,
    used: false,
    created_at: new Date().toISOString(),
  })

  if (error) { codeMsg.value = '❌ ' + error.message; codeMsgType.value = 'err'; return }

  generatedCode.value = code
  codeMsg.value = '✅ 已生成'
  codeMsgType.value = 'ok'
  setTimeout(() => { codeMsg.value = '' }, 3000)
}

function copyCode() {
  navigator.clipboard?.writeText(generatedCode.value)
  codeMsg.value = '✅ 已复制'
  codeMsgType.value = 'ok'
  setTimeout(() => { codeMsg.value = '' }, 2000)
}

// ============================================================
// 一言管理
// ============================================================
async function loadQuotes() {
  console.log('🔄 [一言] 开始加载...')
  quotes.value = []
  
  try {
    const { data, error } = await supabase
      .from('user_quotes')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(1000)

    if (error) {
      console.error('❌ [一言] 加载失败:', error)
      quoteMsg.value = '❌ 加载失败: ' + error.message
      quoteMsgType.value = 'err'
      return
    }

    console.log('✅ [一言] 加载成功，共', data?.length || 0, '条')
    quotes.value = data || []
  } catch (err) {
    console.error('❌ [一言] 异常:', err)
    quoteMsg.value = '❌ 加载异常: ' + err.message
    quoteMsgType.value = 'err'
  }
}

async function addQuote() {
  const content = newQuote.value.trim()
  if (!content) { 
    quoteMsg.value = '⚠️ 请输入内容'
    quoteMsgType.value = 'err'
    return 
  }

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

  if (error) { 
    quoteMsg.value = '❌ ' + error.message
    quoteMsgType.value = 'err'
    return 
  }

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
  if (!content) { 
    quoteMsg.value = '⚠️ 内容不能为空'
    quoteMsgType.value = 'err'
    return 
  }

  const { error } = await supabase
    .from('user_quotes')
    .update({ content })
    .eq('id', editQuoteId.value)

  editModalVisible.value = false

  if (error) { 
    quoteMsg.value = '❌ ' + error.message
    quoteMsgType.value = 'err'
    return 
  }

  quoteMsg.value = '✅ 已修改'
  quoteMsgType.value = 'ok'
  await loadQuotes()
  setTimeout(() => { quoteMsg.value = '' }, 2000)
}

async function deleteQuote(id) {
  if (!confirm('确定删除这条一言吗？')) return

  console.log('🔄 [一言] 删除 ID:', id)

  const { error } = await supabase
    .from('user_quotes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('❌ [一言] 删除失败:', error)
    quoteMsg.value = '❌ ' + error.message
    quoteMsgType.value = 'err'
    return
  }

  console.log('✅ [一言] 删除成功')
  quoteMsg.value = '✅ 已删除'
  quoteMsgType.value = 'ok'
  await loadQuotes()
  setTimeout(() => { quoteMsg.value = '' }, 2000)
}

// ============================================================
// 推荐位管理（修复版）
// ============================================================
async function loadPromos() {
  console.log('🔄 [推荐位] 加载中...')
  promos.value = []
  
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('status', 'active')
      .order('expires_at', { ascending: true })

    if (error) {
      console.error('❌ [推荐位] 加载失败:', error)
      return
    }

    console.log('✅ [推荐位] 加载成功，共', data?.length || 0, '个')
    
    if (data) {
      promos.value = data.map(p => ({
        ...p,
        remaining: Math.max(0, Math.ceil((new Date(p.expires_at) - new Date()) / (1000 * 60 * 60 * 24)))
      }))
    }
  } catch (err) {
    console.error('❌ [推荐位] 异常:', err)
  }
}

async function addPromo() {
  const title = promoTitle.value.trim()
  const url = promoUrl.value.trim()
  
  if (!title || !url) { 
    promoMsg.value = '⚠️ 请填写标题和链接'
    promoMsgType.value = 'err'
    return 
  }

  // 自动添加 http:// 前缀
  let finalUrl = url
  if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
    finalUrl = 'https://' + finalUrl
  }

  const priceMap = { 7: 7.9, 30: 29.9, 365: 298 }
  const expires = new Date()
  expires.setDate(expires.getDate() + promoDays.value)

  console.log('🔄 [推荐位] 添加:', { title, url: finalUrl, days: promoDays.value })

  // 插入时只使用表里实际存在的字段
  const { error } = await supabase
    .from('promotions')
    .insert({
      title,
      url: finalUrl,
      duration_days: promoDays.value,
      price: priceMap[promoDays.value],
      status: 'active',
      expires_at: expires.toISOString(),
      created_at: new Date().toISOString(),
    })

  if (error) {
    console.error('❌ [推荐位] 添加失败:', error)
    promoMsg.value = '❌ ' + error.message
    promoMsgType.value = 'err'
    return
  }

  console.log('✅ [推荐位] 添加成功')
  promoMsg.value = '✅ 已添加'
  promoMsgType.value = 'ok'
  promoTitle.value = ''
  promoUrl.value = ''
  await loadPromos()
  setTimeout(() => { promoMsg.value = '' }, 2000)
}

async function removePromo(id) {
  if (!confirm('确定下架吗？')) return
  
  console.log('🔄 [推荐位] 下架:', id)

  const { error } = await supabase
    .from('promotions')
    .update({ status: 'expired' })
    .eq('id', id)

  if (error) {
    console.error('❌ [推荐位] 下架失败:', error)
    promoMsg.value = '❌ ' + error.message
    promoMsgType.value = 'err'
    return
  }

  console.log('✅ [推荐位] 下架成功')
  await loadPromos()
  promoMsg.value = '✅ 已下架'
  promoMsgType.value = 'ok'
  setTimeout(() => { promoMsg.value = '' }, 2000)
}

// ============================================================
// 生命周期
// ============================================================
onMounted(() => {
  console.log('📌 [Admin] 页面已加载')
  loadQuotes()
  loadPromos()
})
</script>

<style scoped>
.max-h-64::-webkit-scrollbar,
.max-h-40::-webkit-scrollbar {
  width: 3px;
}
.max-h-64::-webkit-scrollbar-thumb,
.max-h-40::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}
.max-h-64::-webkit-scrollbar-track,
.max-h-40::-webkit-scrollbar-track {
  background: transparent;
}
</style>