<template>
  <div class="fish-container w-full max-w-6xl mx-auto px-4 py-6">

    <div class="text-center mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-white drop-shadow-lg tracking-tight">
        🎣 摸鱼时光
      </h1>
      <p class="text-white/50 text-sm mt-1">累了就歇会儿 · 劳逸结合</p>
    </div>

    <!-- ===== 音乐听歌 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">🎵 音乐听歌</span>
        <span class="section-sub text-[10px]">无损 · 免费 · 在线</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in music" :key="item.name" :href="item.url" target="_blank" class="fish-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 在线游戏 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">🎮 在线游戏</span>
        <span class="section-sub text-[10px]">摸鱼必备 · 点击即玩</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in onlineGames" :key="item.name" :href="item.url" target="_blank" class="fish-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 经典游戏 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">🕹️ 经典游戏</span>
        <span class="section-sub text-[10px]">怀旧 · 单机 · 合集</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in classicGames" :key="item.name" :href="item.url" target="_blank" class="fish-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 趣味互动 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">😄 趣味互动</span>
        <span class="section-sub text-[10px]">脑洞 · 解压 · 随机</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in fun" :key="item.name" :href="item.url" target="_blank" class="fish-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 减压放松 ===== -->
    <div>
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">🧘 减压放松</span>
        <span class="section-sub text-[10px]">放空 · 冥想 · 治愈</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in relax" :key="item.name" :href="item.url" target="_blank" class="fish-link">{{ item.name }}</a>
      </div>
    </div>

  </div>
</template>

<script setup>
const music = [
  { name: 'QQ音乐', url: 'https://y.qq.com' },
  { name: '酷狗音乐', url: 'https://www.kugou.com' },
  { name: '酷我音乐', url: 'https://www.kuwo.cn' },
  { name: '网易云音乐', url: 'https://music.163.com' },
  { name: '汽水音乐', url: 'https://www.qishuiyinyue.com' },
  { name: '咪咕音乐', url: 'https://music.migu.cn' },
  { name: '番茄音乐', url: 'https://www.fanqieyinyue.com' },
  { name: '波点音乐', url: 'https://www.bodianyinyue.com' },
  { name: '千千音乐', url: 'https://music.taihe.com' },
  { name: 'Spotify', url: 'https://www.spotify.com' },
  { name: 'Apple Music', url: 'https://music.apple.com' },
  { name: 'YouTube Music', url: 'https://music.youtube.com' },
  { name: 'Amazon Music', url: 'https://music.amazon.com' },
  { name: 'Tidal', url: 'https://tidal.com' },
  { name: 'Deezer', url: 'https://www.deezer.com' },
  { name: 'Pandora', url: 'https://www.pandora.com' },
  { name: 'SoundCloud', url: 'https://soundcloud.com' },
  { name: 'SiriusXM', url: 'https://www.siriusxm.com' },
]

const onlineGames = [
  { name: 'Poki', url: 'https://poki.com' },
  { name: 'CrazyGames', url: 'https://www.crazygames.com' },
  { name: '2048', url: 'https://play2048.co' },
  { name: '俄罗斯方块', url: 'https://tetris.com' },
  { name: '数独', url: 'https://www.sudoku.com' },
  { name: '化学杀', url: 'https://gp0.saobby.com/i/bbv5ur69mpirtt9k' },
  { name: '国际空间站对接', url: 'https://iss-sim.spacex.com' },
]

const classicGames = [
  { name: '4399', url: 'https://www.4399.com' },
  { name: '小霸王在线', url: 'https://www.yikm.net' },
]

const fun = [
  { name: 'neal.fun', url: 'https://neal.fun' },
  { name: 'Useless Web', url: 'https://theuselessweb.com' },
  { name: '猜盐', url: 'https://xiaoce.fun' },
]

const relax = [
  { name: '烟花模拟器', url: 'https://troy.js.org/fireworks-simulator' },
  { name: '流星雨', url: 'https://www.meteorshowers.org' },
  { name: '诗云', url: 'https://shiyun.cohenjikan.com/' },
  { name: '白噪音', url: 'https://www.rainymood.com' },
]
</script>

<style scoped>
.section-title {
  color: #ffffff !important;
}
.section-sub {
  color: rgba(255, 255, 255, 0.40) !important;
}

.fish-link {
  display: block;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.30);
  color: #1a1a2e;
  transition: all 0.2s ease;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
}
.fish-link:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(212, 175, 55, 0.30);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
</style>