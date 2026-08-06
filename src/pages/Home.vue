<template>
  <div class="flex flex-col flex-1 w-full">
    <!-- ===== 主内容区域 ===== -->
    <div class="flex-1 flex flex-col items-center justify-center gap-4 w-full px-4">
      <!-- 品牌名 -->
      <h1 class="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight flex items-center gap-2">
        Unus <span class="text-accent font-light text-3xl md:text-4xl">·</span>
        <span class="font-light">一方</span>
      </h1>

      <!-- ===== 搜索框 ===== -->
      <div class="search-wrapper w-full max-w-xl flex items-stretch rounded-2xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-accent/50 relative z-20">
        <div class="relative flex items-center pl-4 pr-2 border-r border-gray-200 cursor-pointer select-none" @click="toggleDropdown">
          <span class="text-gray-800 text-sm font-medium whitespace-nowrap flex items-center gap-1.5">
            {{ selectedPlatform.name }}
          </span>
          <i class="fas fa-chevron-down text-gray-400 text-[10px] ml-1 transition-transform" :class="{ 'rotate-180': isDropdownOpen }"></i>
        </div>

        <input
          type="text"
          v-model="query"
          @keydown.enter="search"
          placeholder="搜索你想要的..."
          class="flex-1 bg-transparent text-gray-800 placeholder-gray-400 px-4 py-3 outline-none text-base font-light min-w-0"
          autofocus
        />

        <button @click="search" class="px-5 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0">
          <i class="fas fa-search text-lg"></i>
        </button>
      </div>

      <!-- ===== 下拉菜单 ===== -->
      <div v-if="isDropdownOpen" class="relative w-full max-w-xl z-50 -mt-1">
        <div class="dropdown-menu rounded-2xl p-4 shadow-lg">
          <div class="mb-3">
            <div class="dropdown-label text-[10px] font-semibold tracking-wider uppercase mb-2 flex items-center gap-2">
              <span class="w-4 h-px bg-gray-300"></span> 搜索引擎
            </div>
            <div class="flex flex-wrap gap-1.5">
              <div
                v-for="item in enginePlatforms"
                :key="item.name"
                class="platform-item"
                :class="{ active: selectedPlatform.name === item.name }"
                @click="selectPlatform(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>

          <div>
            <div class="dropdown-label text-[10px] font-semibold tracking-wider uppercase mb-2 flex items-center gap-2">
              <span class="w-4 h-px bg-gray-300"></span> 应用与社区
            </div>
            <div class="flex flex-wrap gap-1.5">
              <div
                v-for="item in socialPlatforms"
                :key="item.name"
                class="platform-item"
                :class="{ active: selectedPlatform.name === item.name }"
                @click="selectPlatform(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 功能区块 ===== -->
      <div class="w-full max-w-xl mt-3 space-y-4">
        <!-- 自定义链接 -->
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="section-title text-sm font-medium tracking-wide">
              <i class="fas fa-bookmark mr-1"></i> 我的链接
            </span>
            <span v-if="!userStore.isLoggedIn" class="section-hint">
              · <router-link to="/login" class="text-accent hover:underline">登录</router-link> 后自定义
            </span>
            <span v-else class="section-hint">
              · {{ links.length }} / {{ linkLimit }} 个
            </span>
          </div>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(link, index) in links"
              :key="index"
              class="link-card-wrapper"
            >
              <a :href="link.url" target="_blank" class="link-card">
                <i class="fas fa-link"></i> {{ link.name }}
              </a>
              <button
                v-if="userStore.isLoggedIn"
                class="link-delete-btn"
                @click="deleteLink(index)"
                title="删除此链接"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <a
              v-if="!userStore.isLoggedIn"
              href="#"
              class="link-card add-btn"
              @click.prevent="goLogin"
            >
              <i class="fas fa-plus"></i> 添加
            </a>
            <a
              v-else-if="userStore.isLoggedIn && links.length < linkLimit"
              href="#"
              class="link-card add-btn"
              @click.prevent="openAddModal"
            >
              <i class="fas fa-plus"></i> 添加
            </a>
            <a
              v-else-if="userStore.isLoggedIn && links.length >= linkLimit && userStore.effectiveSubscription !== 'yearly'"
              href="#"
              class="link-card add-btn-full"
              @click.prevent="goSupport"
            >
              <i class="fas fa-lock"></i> 已达上限
            </a>
          </div>
        </div>

        <!-- ===== 公共推荐位 ===== -->
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="section-title text-sm font-medium tracking-wide">
              <i class="fas fa-fire mr-1"></i> 推荐
            </span>
            <span class="section-hint">· 推广位</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <a
              v-for="item in promotions"
              :key="item.id"
              :href="item.url"
              target="_blank"
              class="link-card promo-card"
            >
              <span v-if="item.icon" class="mr-0.5">{{ item.icon }}</span>
              {{ item.title }}
              <span class="badge-promote">推广</span>
              <span class="promo-remaining">· {{ item.remaining }}d</span>
            </a>

            <router-link
              to="/support"
              class="link-card guide-card"
            >
              <i class="fas fa-rocket text-accent"></i>
              <span class="guide-text">
                {{ promotions.length > 0 ? '想让你的网站也出现在这里？' : '想让你的网站出现在这里？' }}
              </span>
              <span class="guide-arrow">→ 了解更多</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 添加链接模态框（已改为白色毛玻璃 + 深色文字） ===== -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="closeModal">
      <div class="modal-light rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <i class="fas fa-plus-circle text-accent"></i> 添加链接
        </h3>
        <div class="space-y-3">
          <div>
            <label class="text-gray-600 text-xs font-medium uppercase tracking-wider block mb-1">链接名称</label>
            <input
              type="text"
              v-model="newLinkName"
              placeholder="例如：我的博客"
              class="modal-input w-full rounded-lg px-4 py-2 outline-none transition"
              @keydown.enter="confirmAddLink"
              autofocus
            />
          </div>
          <div>
            <label class="text-gray-600 text-xs font-medium uppercase tracking-wider block mb-1">链接地址</label>
            <input
              type="text"
              v-model="newLinkUrl"
              placeholder="https://example.com"
              class="modal-input w-full rounded-lg px-4 py-2 outline-none transition"
              @keydown.enter="confirmAddLink"
            />
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="confirmAddLink" class="flex-1 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent font-medium hover:bg-accent/30 transition">
            确认添加
          </button>
          <button @click="closeModal" class="flex-1 py-2 rounded-lg bg-white/60 border border-gray-200 text-gray-700 font-medium hover:bg-white/80 transition">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { supabase } from '../lib/supabase'

const router = useRouter()
const userStore = useUserStore()

// ============================================================
// 状态
// ============================================================
const query = ref('')
const isDropdownOpen = ref(false)
const links = ref([])
const promotions = ref([])
const showModal = ref(false)
const newLinkName = ref('')
const newLinkUrl = ref('')
const selectedPlatform = ref({ name: '百度', type: 'engine', url: 'https://www.baidu.com/s?wd=' })

const enginePlatforms = [
  { name: '百度', type: 'engine', url: 'https://www.baidu.com/s?wd=' },
  { name: '必应', type: 'engine', url: 'https://cn.bing.com/search?q=' },
  { name: 'Google', type: 'engine', url: 'https://www.google.com/search?q=' },
  { name: '搜狗', type: 'engine', url: 'https://www.sogou.com/web?query=' },
]

const socialPlatforms = [
  { name: '抖音', type: 'social', url: 'https://www.douyin.com/search/' },
  { name: '小红书', type: 'social', url: 'https://www.xiaohongshu.com/search_result?keyword=' },
  { name: 'B站', type: 'social', url: 'https://search.bilibili.com/all?keyword=' },
  { name: '知乎', type: 'social', url: 'https://www.zhihu.com/search?type=content&q=' },
  { name: '微博', type: 'social', url: 'https://s.weibo.com/weibo?q=' },
  { name: '豆瓣', type: 'social', url: 'https://www.douban.com/search?q=' },
]

// ============================================================
// 链接上限
// ============================================================
const linkLimit = computed(() => {
  if (!userStore.isLoggedIn) return 3
  const sub = userStore.effectiveSubscription
  if (sub === 'yearly') return 20
  if (sub === 'monthly') return 8
  return 3
})

function search() {
  const keyword = query.value.trim()
  if (!keyword) return
  const platform = selectedPlatform.value
  const url = platform.url + encodeURIComponent(keyword)
  window.open(url, '_blank')
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function selectPlatform(item) {
  selectedPlatform.value = item
  isDropdownOpen.value = false
  localStorage.setItem('unus_last_platform', JSON.stringify({ name: item.name }))
}

function goSupport() {
  router.push('/support')
}

function goLogin() {
  router.push('/login')
}

// ============================================================
// 自定义链接
// ============================================================
function loadCustomLinks() {
  const allLinks = (userStore.isLoggedIn && userStore.profile?.custom_links) || []
  links.value = allLinks.slice(0, linkLimit.value)
}

async function saveCustomLinks() {
  if (!userStore.isLoggedIn) return
  try {
    await userStore.updateCustomLinks(userStore.profile?.custom_links || [])
  } catch (err) {
    console.error('保存链接失败:', err)
    alert('保存失败：' + err.message)
  }
}

function openAddModal() {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  if (links.value.length >= linkLimit.value) {
    alert(`已达到链接上限（${linkLimit.value}个）`)
    return
  }
  newLinkName.value = ''
  newLinkUrl.value = ''
  showModal.value = true
  setTimeout(() => {
    const input = document.querySelector('.modal-input')
    if (input) input.focus()
  }, 100)
}

function closeModal() {
  showModal.value = false
  newLinkName.value = ''
  newLinkUrl.value = ''
}

async function confirmAddLink() {
  const name = newLinkName.value.trim()
  let url = newLinkUrl.value.trim()

  if (!name) { alert('请输入链接名称'); return }
  if (!url) { alert('请输入链接地址'); return }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }

  const allLinks = userStore.isLoggedIn && userStore.profile?.custom_links || []
  const newLink = { name, url }
  const updatedLinks = [...allLinks, newLink]

  await userStore.updateCustomLinks(updatedLinks)
  loadCustomLinks()
  closeModal()
}

async function deleteLink(index) {
  if (!userStore.isLoggedIn) return
  const linkName = links.value[index].name
  if (!confirm(`确定删除「${linkName}」吗？`)) return

  const allLinks = userStore.isLoggedIn && userStore.profile?.custom_links || []
  allLinks.splice(index, 1)
  await userStore.updateCustomLinks(allLinks)
  loadCustomLinks()
}

// ============================================================
// 推荐位
// ============================================================
async function loadPromotions() {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('status', 'active')
      .order('expires_at', { ascending: true })

    if (error) {
      console.error('加载推荐位失败:', error)
      return
    }

    if (data) {
      promotions.value = data.map(item => ({
        ...item,
        remaining: Math.max(0, Math.ceil((new Date(item.expires_at) - new Date()) / (1000 * 60 * 60 * 24)))
      }))
    }
  } catch (err) {
    console.error('加载推荐位异常:', err)
  }
}

function handleClickOutside(event) {
  const wrapper = event.target.closest('.search-wrapper')
  const dropdown = event.target.closest('.relative.z-50')
  if (!wrapper && !dropdown) {
    isDropdownOpen.value = false
  }
}

watch(
  () => userStore.isLoggedIn,
  () => { loadCustomLinks() }
)

watch(
  () => userStore.effectiveSubscription,
  () => { loadCustomLinks() }
)

onMounted(() => {
  const lastPlatform = localStorage.getItem('unus_last_platform')
  if (lastPlatform) {
    try {
      const parsed = JSON.parse(lastPlatform)
      const allPlatforms = [...enginePlatforms, ...socialPlatforms]
      const found = allPlatforms.find(p => p.name === parsed.name)
      if (found) {
        selectedPlatform.value = found
      }
    } catch (e) {}
  }

  loadCustomLinks()
  loadPromotions()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ===== 搜索框 ===== */
.search-wrapper {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.search-wrapper:focus-within {
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.25);
  border-color: #d4af37;
}

/* ===== 下拉菜单 ===== */
.dropdown-menu {
  background: rgba(255, 255, 255, 0.80);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.dropdown-label {
  color: #1a1a2e !important;
}
.dropdown-label .bg-gray-300 {
  background-color: #d1d5db !important;
}

/* ===== 平台选项 ===== */
.platform-item {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  color: #1a1a2e;
  transition: all 0.15s ease;
  background: rgba(255, 255, 255, 0.70);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.platform-item:hover {
  background: rgba(255, 255, 255, 0.90);
}
.platform-item.active {
  background: rgba(212, 175, 55, 0.15);
  border-color: rgba(212, 175, 55, 0.30);
  color: #d4af37;
}

/* ===== 分类标题 ===== */
.section-title {
  color: #ffffff !important;
}
.section-hint {
  color: rgba(255, 255, 255, 0.50) !important;
  font-size: 0.65rem;
}

/* ===== 链接卡片 ===== */
.link-card-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.link-card-wrapper .link-card {
  padding-right: 28px;
}

.link-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #1a1a2e;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.link-card:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
}
.link-card.add-btn {
  border: 1px dashed rgba(0, 0, 0, 0.20);
  background: rgba(255, 255, 255, 0.50);
  color: #1a1a2e;
}
.link-card.add-btn:hover {
  background: rgba(255, 255, 255, 0.80);
}
.link-card.add-btn-full {
  border: 1px solid rgba(255, 80, 80, 0.30);
  background: rgba(255, 60, 60, 0.10);
  color: rgba(255, 80, 80, 0.85);
  cursor: pointer;
}
.link-card.add-btn-full:hover {
  background: rgba(255, 60, 60, 0.20);
  transform: translateY(-2px);
}

.link-delete-btn {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 100, 100, 0.15);
  color: rgba(255, 100, 100, 0.70);
  font-size: 9px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
}
.link-delete-btn:hover {
  background: rgba(255, 50, 50, 0.30);
  color: #fff;
  transform: translateY(-50%) scale(1.1);
}

/* ===== 推广位 ===== */
.promo-card {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(4px) !important;
  -webkit-backdrop-filter: blur(4px) !important;
  border: 1px solid rgba(212, 175, 55, 0.40) !important;
  color: #1a1a2e !important;
}
.promo-card:hover {
  background: rgba(255, 255, 255, 0.95) !important;
  transform: translateY(-2px);
}

.promo-remaining {
  color: #d4af37 !important;
  font-size: 0.65rem;
}

.badge-promote {
  font-size: 0.5rem;
  background: rgba(212, 175, 55, 0.80);
  color: #fff;
  padding: 1px 8px;
  border-radius: 20px;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin-left: 4px;
}

/* ===== 引导卡片 ===== */
.guide-card {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(4px) !important;
  -webkit-backdrop-filter: blur(4px) !important;
  border: 1px solid rgba(212, 175, 55, 0.40) !important;
  color: #1a1a2e !important;
  transition: all 0.3s ease !important;
}
.guide-card:hover {
  background: rgba(255, 255, 255, 0.95) !important;
  transform: translateY(-2px) !important;
  border-color: rgba(212, 175, 55, 0.60) !important;
}

.guide-text {
  color: #1a1a2e;
}
.guide-arrow {
  color: #d4af37;
  font-size: 0.65rem;
}

/* ===== 模态框（白色毛玻璃 + 深色文字） ===== */
.modal-light {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.50);
}

.modal-input {
  background: rgba(255, 255, 255, 0.60);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #1a1a2e;
}
.modal-input::placeholder {
  color: rgba(0, 0, 0, 0.30);
}
.modal-input:focus {
  border-color: rgba(212, 175, 55, 0.40);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.08);
}
</style>