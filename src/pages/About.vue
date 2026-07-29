<template>
  <div class="about-container w-full max-w-2xl mx-auto px-4 py-8">

    <!-- ===== 标题 ===== -->
    <div class="text-center mb-10">
      <h1 class="text-3xl md:text-4xl font-bold text-white drop-shadow-lg tracking-tight">
        📖 关于 <span class="text-accent">Unus · 一方</span>
      </h1>
      <p class="text-white/80 text-sm mt-2 tracking-wider">
        一方天地，属于你的数字空间
      </p>
    </div>

    <div class="space-y-6">

      <!-- ===== 设计理念 ===== -->
      <div class="glass dark:glass-dark rounded-2xl p-6 border border-white/10">
        <div class="space-y-4 text-white/90 text-sm leading-relaxed">
          <p>
            你有没有想过——每天打开浏览器的那一瞬间，你看到的是什么？
          </p>
          <p>
            是满屏的广告、推送、推荐算法，还是——一个你熟悉的、安静的、属于你的角落？
          </p>
          <p class="text-white font-medium">
            Unus · 一方，就是那个角落。
          </p>
          <p>
            这里没有繁杂的信息流，没有猜你喜欢的推送。只有你喜欢的壁纸，你常用的链接，你习惯的搜索方式。
          </p>
          <p>
            它不喧哗，不打扰，就像一张你熟悉的书桌，一杯刚好温度的茶。
          </p>
          <p class="text-white/70 text-sm">
            每次打开浏览器，都是一次「回家」。
          </p>
        </div>
      </div>

      <!-- ===== 关于开发者 ===== -->
      <div class="glass dark:glass-dark rounded-2xl p-6 border border-white/10">
        <div class="space-y-4 text-white/90 text-sm leading-relaxed">
          <p>
            我叫 <span class="text-white font-medium">Gesoleerdeiland</span>。
          </p>
          <p>
            做这个网站，没有什么宏大的野心。只是觉得，在算法和流量之外，应该还有一个小小的角落，是为「人」本身而存在的。
          </p>
          <p>
            一方不是一个产品，它是我理想中互联网该有的样子——安静、克制、留白。
          </p>
          <p class="text-white/70 text-sm">
            如果你在这里感受到了什么，那就是我想给你的。
          </p>
        </div>
      </div>

      <!-- ===== 联系方式 ===== -->
      <div class="glass dark:glass-dark rounded-2xl p-6 border border-white/10">
        <p class="text-white/80 text-sm mb-3">📮 如果你有什么想说的：</p>
        <div class="space-y-2 text-sm">
          <p class="text-white/90 flex items-center gap-3">
            <span class="text-white/50 text-base">📧</span>
            邮箱：<span class="text-white font-medium">3931095272@qq.com</span>
          </p>
          <p class="text-white/90 flex items-center gap-3">
            <span class="text-white/50 text-base">💬</span>
            微信：<span class="text-white font-medium">w18829558536</span>
          </p>
          <p class="text-white/90 flex items-center gap-3">
            <span class="text-white/50 text-base">📕</span>
            小红书：<span class="text-white font-medium">w18829558536</span>
          </p>
        </div>
      </div>

      <!-- ===== 生长中 ===== -->
      <div class="glass dark:glass-dark rounded-2xl p-6 border border-white/10">
        <div class="space-y-4 text-white/90 text-sm leading-relaxed">
          <p>
            一方现在还很小，但它会长大。
          </p>
          <p>
            从搜索框到自定义链接，从壁纸到 AI 助手，每一块都在慢慢长成它该有的样子。
          </p>
          <p class="text-white font-medium">
            如果你也喜欢这种「慢慢生长」的感觉——
          </p>
          <p>
            欢迎你成为一方的一部分。
          </p>
          <p class="text-white/70 text-sm">
            你的支持，会让它变得更好。
          </p>
        </div>

        <!-- 两个按钮 -->
        <div class="mt-5 flex flex-wrap items-center justify-center gap-4">
          <router-link
            to="/support"
            class="inline-block px-8 py-3 rounded-xl bg-accent/20 border border-accent/30 text-accent font-medium hover:bg-accent/30 transition text-sm"
          >
            💛 支持一方
          </router-link>
          <button
            @click="openSetHomeGuide"
            class="inline-block px-8 py-3 rounded-xl bg-white/20 border border-white/30 text-white font-medium hover:bg-white/30 transition text-sm"
          >
            🏠 设为首页
          </button>
        </div>
        <p class="text-white/60 text-[10px] mt-3 text-center tracking-wider">
          你的每一次支持，都是一次「我在这里」的确认
        </p>
      </div>

      <!-- ===== 技术栈 ===== -->
      <div class="text-center text-white/50 text-xs tracking-widest">
        ⚡ Vue 3 · Supabase · Tailwind · Vite
      </div>

    </div>

    <!-- ===== 设为首页引导弹窗 ===== -->
    <div v-if="showGuide" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showGuide = false">
      <div class="glass dark:glass-dark rounded-2xl border border-white/20 p-6 w-full max-w-md shadow-2xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white font-semibold text-lg flex items-center gap-2">
            <span>🏠</span> 设为浏览器首页
          </h3>
          <button @click="showGuide = false" class="text-white/60 hover:text-white/90 transition">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="space-y-4 text-sm">
          <p class="text-white/70">
            浏览器不支持一键设置首页，请按以下步骤手动操作：
          </p>

          <div class="space-y-3">
            <div class="bg-white/5 rounded-lg p-3">
              <div class="flex items-center gap-2 text-white/80 font-medium text-xs">
                <span class="text-white/50">①</span> Chrome / Edge
              </div>
              <p class="text-white/50 text-xs mt-1 leading-relaxed">
                设置 → 启动时 → 打开特定网页 → 添加 <span class="text-white/80 break-all">{{ siteUrl }}</span>
              </p>
            </div>

            <div class="bg-white/5 rounded-lg p-3">
              <div class="flex items-center gap-2 text-white/80 font-medium text-xs">
                <span class="text-white/50">②</span> Firefox
              </div>
              <p class="text-white/50 text-xs mt-1 leading-relaxed">
                设置 → 主页 → 主页和新窗口 → 自定义网址 <span class="text-white/80 break-all">{{ siteUrl }}</span>
              </p>
            </div>

            <div class="bg-white/5 rounded-lg p-3">
              <div class="flex items-center gap-2 text-white/80 font-medium text-xs">
                <span class="text-white/50">③</span> Safari
              </div>
              <p class="text-white/50 text-xs mt-1 leading-relaxed">
                偏好设置 → 通用 → 主页 → 输入 <span class="text-white/80 break-all">{{ siteUrl }}</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 mt-2">
            <input
              ref="urlInput"
              :value="siteUrl"
              readonly
              class="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs outline-none"
            />
            <button
              @click="copyUrl"
              class="px-4 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent text-xs font-medium hover:bg-accent/30 transition whitespace-nowrap"
            >
              复制链接
            </button>
          </div>
          <p v-if="copyMsg" class="text-green-400 text-xs text-center">{{ copyMsg }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const showGuide = ref(false)
const copyMsg = ref('')
const siteUrl = ref(window.location.origin)

function openSetHomeGuide() {
  showGuide.value = true
  copyMsg.value = ''
}

function copyUrl() {
  navigator.clipboard.writeText(siteUrl.value).then(() => {
    copyMsg.value = '✅ 已复制，快去浏览器设置里粘贴吧！'
    setTimeout(() => { copyMsg.value = '' }, 3000)
  }).catch(() => {
    const input = document.querySelector('.flex-1.bg-white\\/10')
    if (input) {
      input.select()
      document.execCommand('copy')
      copyMsg.value = '✅ 已复制！'
      setTimeout(() => { copyMsg.value = '' }, 3000)
    }
  })
}
</script>

<style scoped>
/* 所有文字默认清晰，无额外虚化 */
</style>