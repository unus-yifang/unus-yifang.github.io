<template>
  <div class="ai-assistant" ref="assistantRef">
    <!-- 悬浮气泡 -->
    <div
      class="assistant-bubble"
      @click="toggleChat"
      :class="{ 'bubble-hidden': isChatOpen }"
    >
      <span class="ai-art-text">AI</span>
    </div>

    <!-- 聊天窗口 -->
    <div v-if="isChatOpen" class="chat-window glass dark:glass-dark">
      <!-- 标题栏 -->
      <div class="chat-header">
        <div class="flex items-center gap-2">
          <span class="text-white font-semibold text-lg">小U</span>
          <span class="text-white/80 text-[10px]">
            {{ remainingFreeCount > 0 ? `今日免费 ${remainingFreeCount} 次` : '💰 1 U币/次' }}
          </span>
          <span v-if="userStore.isLoggedIn && userStore.effectiveSubscription !== 'free'" class="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent">
            {{ userStore.effectiveSubscription === 'yearly' ? '年卡' : '月卡' }}
          </span>
        </div>
        <button @click="closeChat" class="text-white/70 hover:text-white transition">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- 消息列表 -->
      <div ref="messagesContainer" class="chat-messages">
        <div v-if="messages.length === 0" class="chat-empty">
          <span class="text-3xl mb-2">👋</span>
          <span class="text-white/80 text-sm">你好！我是小U，有什么可以帮你的？</span>
          <span class="text-white/60 text-[10px] mt-1">试试问我关于「一方」的任何问题</span>
        </div>
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="chat-message"
          :class="msg.role === 'user' ? 'message-user' : 'message-assistant'"
        >
          <div class="message-bubble" :class="msg.role === 'user' ? 'bubble-user' : 'bubble-assistant'">
            <span v-if="msg.role === 'assistant'" class="text-accent text-xs mr-1">小U</span>
            <span v-html="formatMessage(msg.content)"></span>
          </div>
        </div>
        <div v-if="isLoading" class="chat-message message-assistant">
          <div class="message-bubble bubble-assistant">
            <span class="typing-dots">● ● ●</span>
          </div>
        </div>
      </div>

      <!-- 输入区 -->
      <div class="chat-input-area">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="输入你的问题..."
          class="chat-input"
          @keydown.enter="sendMessage"
          :disabled="isLoading"
        />
        <button
          @click="sendMessage"
          class="chat-send-btn"
          :disabled="isLoading || !inputMessage.trim()"
        >
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'
import { supabase } from '../lib/supabase'
import { marked } from 'marked'

// 配置 marked
marked.setOptions({
  gfm: true,
  breaks: true,
})

const userStore = useUserStore()

// ============================================================
// 状态
// ============================================================
const isChatOpen = ref(false)
const inputMessage = ref('')
const messages = ref([])
const isLoading = ref(false)
const messagesContainer = ref(null)
const remainingFreeCount = ref(3)
const assistantRef = ref(null)

// ============================================================
// 根据订阅获取每日最大免费次数
// ============================================================
function getMaxFreeCount() {
  const sub = userStore.effectiveSubscription
  if (sub === 'yearly') return 20
  if (sub === 'monthly') return 8
  return 3
}

// ============================================================
// 获取今天的日期字符串
// ============================================================
function getToday() {
  return new Date().toISOString().split('T')[0]
}

// ============================================================
// 从数据库加载免费次数
// ============================================================
async function loadFreeCount() {
  if (!userStore.isLoggedIn) {
    console.log('⚠️ [小U] 未登录，跳过加载')
    return
  }

  await userStore.fetchProfile()
  const profile = userStore.profile
  if (!profile) {
    console.log('⚠️ [小U] profile 为空')
    return
  }

  const today = getToday()
  const storedDate = profile.ai_free_date
  const storedCount = profile.ai_free_count ?? 3
  const maxFree = getMaxFreeCount()
  const currentSub = userStore.effectiveSubscription

  if (storedDate !== today) {
    remainingFreeCount.value = maxFree
    await userStore.updateAIFreeCount(maxFree, today)
    console.log('✅ [小U] 新的一天，重置为:', maxFree)
    return
  }

  const subLevel = { 'free': 0, 'monthly': 1, 'yearly': 2 }
  const lastSub = localStorage.getItem('unus_last_subscription') || 'free'
  if (subLevel[currentSub] > subLevel[lastSub]) {
    remainingFreeCount.value = maxFree
    await userStore.updateAIFreeCount(maxFree, today)
    localStorage.setItem('unus_last_subscription', currentSub)
    console.log('✅ [小U] 订阅升级，重置为:', maxFree)
    return
  }

  const finalCount = Math.min(storedCount, maxFree)
  remainingFreeCount.value = finalCount
  localStorage.setItem('unus_last_subscription', currentSub)
  console.log('✅ [小U] 读取数据库次数:', finalCount)
}

async function decrementFreeCount() {
  const newCount = remainingFreeCount.value - 1
  remainingFreeCount.value = newCount
  const today = getToday()
  await userStore.updateAIFreeCount(newCount, today)
  console.log('✅ [小U] 扣费后保存到数据库:', newCount)
}

// ============================================================
// 切换聊天
// ============================================================
async function toggleChat() {
  if (!userStore.isLoggedIn) {
    const currentPath = window.location.pathname + window.location.search
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
    return
  }
  isChatOpen.value = !isChatOpen.value
  if (isChatOpen.value) {
    await loadFreeCount()
    nextTick(() => {
      const input = document.querySelector('.chat-input')
      if (input) input.focus()
    })
  }
}

function closeChat() {
  isChatOpen.value = false
}

function handleClickOutside(event) {
  if (!assistantRef.value) return
  const isInside = assistantRef.value.contains(event.target)
  if (!isInside && isChatOpen.value) {
    closeChat()
  }
}

// ============================================================
// 发送消息
// ============================================================
async function sendMessage() {
  const text = inputMessage.value.trim()
  if (!text || isLoading.value) return

  if (remainingFreeCount.value <= 0 && userStore.ucoins < 1) {
    alert('U币不足，请签到或支持开发者获取U币 🪙')
    return
  }

  messages.value.push({ role: 'user', content: text })
  inputMessage.value = ''
  isLoading.value = true

  await nextTick()
  scrollToBottom()

  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    console.log('🔍 [小U] 调试信息:')
    console.log('  - token 是否存在:', !!token)
    console.log('  - token 前10位:', token ? token.substring(0, 10) + '...' : '无')
    console.log('  - anonKey 是否存在:', !!anonKey)
    console.log('  - anonKey 前10位:', anonKey ? anonKey.substring(0, 10) + '...' : '无')
    console.log('  - 请求URL:', 'https://oifrhpfekuocvdjixohc.supabase.co/functions/v1/ai-chat')

    if (!token) {
      throw new Error('未登录，请重新登录')
    }

    const response = await fetch(
      'https://oifrhpfekuocvdjixohc.supabase.co/functions/v1/ai-chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': anonKey,
        },
        body: JSON.stringify({
          messages: messages.value.map(m => ({ role: m.role, content: m.content }))
        })
      }
    )

    console.log('🔍 [小U] 响应状态码:', response.status)
    console.log('🔍 [小U] 响应状态文本:', response.statusText)

    if (response.status === 401) {
      throw new Error('登录已过期，请重新登录')
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''
    let buffer = ''

    const assistantIndex = messages.value.length
    messages.value.push({ role: 'assistant', content: '' })

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue
        const data = trimmed.slice(6)
        if (data === '[DONE]') continue
        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content
          if (content) {
            fullContent += content
            messages.value[assistantIndex].content = fullContent
            await nextTick()
            scrollToBottom()
          }
        } catch (e) {}
      }
    }

    if (!fullContent || fullContent.trim() === '') {
      messages.value[assistantIndex].content = '抱歉，我没有理解你的问题，能再详细说说吗？'
    }

    if (remainingFreeCount.value > 0) {
      await decrementFreeCount()
    } else {
      await userStore.deductCoins(1)
      await userStore.fetchProfile()
    }

  } catch (err) {
    console.error('❌ [小U] AI 对话错误:', err)
    messages.value.push({ role: 'assistant', content: err.message || '出错了，请稍后再试 😅' })
  } finally {
    isLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}

// ============================================================
// 辅助函数
// ============================================================
function formatMessage(content) {
  if (!content) return ''
  return marked.parse(content)
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(
  () => userStore.effectiveSubscription,
  async () => {
    await loadFreeCount()
  },
  { immediate: true }
)

onMounted(() => {
  loadFreeCount()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ===== 悬浮气泡 ===== */
.ai-assistant {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 100;
}

.assistant-bubble {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.2);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 24px rgba(212, 175, 55, 0.15);
}
.assistant-bubble:hover {
  transform: scale(1.08);
  background: rgba(212, 175, 55, 0.35);
  box-shadow: 0 4px 32px rgba(212, 175, 55, 0.25);
}
.assistant-bubble.bubble-hidden {
  opacity: 0;
  pointer-events: none;
  transform: scale(0.8);
}

.ai-art-text {
  font-size: 28px;
  font-weight: 900;
  font-family: 'Georgia', 'Times New Roman', serif;
  background: linear-gradient(135deg, #d4af37 0%, #f5d97e 30%, #d4af37 60%, #b8962a 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.3));
  letter-spacing: 1px;
  animation: shimmer 3s ease-in-out infinite;
  line-height: 1;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* ===== 聊天窗口 ===== */
.chat-window {
  position: absolute;
  bottom: 76px;
  right: 0;
  width: 380px;
  height: 500px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.4);
}
.dark .chat-window {
  border-color: rgba(255, 255, 255, 0.08);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ===== 标题栏 ===== */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}
.dark .chat-header {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}
.chat-header button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}

/* ===== 消息列表 ===== */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;
}
.chat-messages::-webkit-scrollbar {
  width: 3px;
}
.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}
.dark .chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
}

.chat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
}
.dark .chat-empty {
  color: rgba(255, 255, 255, 0.3);
}

.chat-message {
  display: flex;
  max-width: 90%;
}
.message-user {
  justify-content: flex-end;
  align-self: flex-end;
}
.message-assistant {
  justify-content: flex-start;
  align-self: flex-start;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 0.85rem;
  line-height: 1.6;
  word-break: break-word;
  max-width: 100%;
}
.bubble-user {
  background: rgba(212, 175, 55, 0.25);
  border: 1px solid rgba(212, 175, 55, 0.2);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.dark .bubble-user {
  background: rgba(212, 175, 55, 0.15);
  border-color: rgba(212, 175, 55, 0.1);
}
.bubble-assistant {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  border-bottom-left-radius: 4px;
}
.dark .bubble-assistant {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.04);
}

.typing-dots {
  display: inline-block;
  animation: pulse 1.2s ease-in-out infinite;
  letter-spacing: 4px;
  font-size: 14px;
}
@keyframes pulse {
  0%, 60%, 100% { opacity: 0.3; }
  30% { opacity: 1; }
}

/* ===== 输入区 ===== */
.chat-input-area {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}
.dark .chat-input-area {
  border-top-color: rgba(255, 255, 255, 0.06);
}
.chat-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 8px 14px;
  color: white;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s ease;
}
.dark .chat-input {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
}
.chat-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}
.dark .chat-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.chat-input:focus {
  border-color: rgba(212, 175, 55, 0.3);
}
.chat-input:disabled {
  opacity: 0.5;
}

.chat-send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(212, 175, 55, 0.25);
  border: 1px solid rgba(212, 175, 55, 0.2);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dark .chat-send-btn {
  background: rgba(212, 175, 55, 0.15);
  border-color: rgba(212, 175, 55, 0.1);
  color: rgba(255, 255, 255, 0.6);
}
.chat-send-btn:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.4);
  color: #fff;
  transform: scale(1.05);
}
.dark .chat-send-btn:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.25);
  color: #fff;
}
.chat-send-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ===== 响应式 ===== */
@media (max-width: 500px) {
  .chat-window {
    width: 92vw;
    right: -10px;
    height: 70vh;
    bottom: 68px;
  }
  .assistant-bubble {
    width: 56px;
    height: 56px;
  }
  .ai-art-text {
    font-size: 24px;
  }
}
</style>