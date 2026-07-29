<template>
  <div class="discover-container w-full max-w-6xl mx-auto px-4 py-6">

    <div class="text-center mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-white drop-shadow-lg tracking-tight">
        🔗 发现好站
      </h1>
      <p class="text-white/50 text-sm mt-1">精选互联网上有趣的灵魂</p>
    </div>

    <!-- ===== 有趣网站 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="text-white text-sm font-medium tracking-wide">💡 有趣网站</span>
        <span class="text-white/30 text-[10px]">脑洞 · 创意 · 导航</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in funSites" :key="item.name" :href="item.url" target="_blank" class="discover-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 小说阅读 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="text-white text-sm font-medium tracking-wide">📚 小说阅读</span>
        <span class="text-white/30 text-[10px]">搜书 · 免费 · 电子书</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in novels" :key="item.name" :href="item.url" target="_blank" class="discover-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 影视娱乐 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="text-white text-sm font-medium tracking-wide">🎬 影视娱乐</span>
        <span class="text-white/30 text-[10px]">追剧 · 直播 · 解析</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in movies" :key="item.name" :href="item.url" target="_blank" class="discover-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 资源网站 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="text-white text-sm font-medium tracking-wide">📦 资源网站</span>
        <span class="text-white/30 text-[10px]">插件 · 软件 · 分享</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in resources" :key="item.name" :href="item.url" target="_blank" class="discover-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 全球探索 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="text-white text-sm font-medium tracking-wide">🌍 全球探索</span>
        <span class="text-white/30 text-[10px]">地理 · 历史 · 文化</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in explore" :key="item.name" :href="item.url" target="_blank" class="discover-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 游戏资源 ===== -->
    <div>
      <div class="flex items-center gap-2 mb-2.5">
        <span class="text-white text-sm font-medium tracking-wide">🎮 游戏资源</span>
        <span class="text-white/30 text-[10px]">下载 · 分享 · 单机</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in gameRes" :key="item.name" :href="item.url" target="_blank" class="discover-link">{{ item.name }}</a>
      </div>
    </div>

  </div>
</template>

<script setup>
const funSites = [
  { name: '霂明导航', url: 'https://n.mumingfang.com' },
  { name: '沙雕导航', url: 'https://shadiao.pro' },
  { name: '龙轩导航', url: 'http://ilxdh.com' },
  { name: 'Tbox导航', url: 'https://www.tboxn.com' },
  { name: '学吧导航', url: 'https://www.xue8nav.com' },
  { name: '创造狮导航', url: 'https://chuangzaoshi.com' },
  { name: '设计导航', url: 'https://hao.shejidaren.com' },
  { name: 'Wikihow', url: 'https://zh.wikihow.com' },
  { name: 'Sharkle', url: 'https://sharkle.com' },
  { name: 'Useless Web', url: 'https://theuselessweb.com' },
]

const novels = [
  { name: '鸠摩搜索', url: 'https://www.jiumodiary.com' },
  { name: '资源帝', url: 'https://shu.ziyuandi.cn' },
  { name: '喜欢书签', url: 'https://www.likebookmark.com' },
  { name: '书荒部落', url: 'https://noveless.com' },
  { name: 'Z-Library', url: 'https://z-lib.org' },
  { name: '电子书之家', url: 'https://www.ebookhome.com' },
  { name: '八零电子书', url: 'https://www.80txt.com' },
  { name: '小说巴士', url: 'https://www.xs8.com' },
  { name: '盐选', url: 'https://www.yanxuan.com' },
  { name: '鬼话连篇网', url: 'https://www.ghoststory.com' },
  { name: '金庸武侠网', url: 'https://www.jinyong.com' },
  { name: 'txt小说网', url: 'https://www.txtxiaoshuo.com' },
]

const movies = [
  { name: '555影视', url: 'https://www.555dy.com' },
  { name: '免费追剧', url: 'https://www.freeju.com' },
  { name: '映像星球', url: 'https://www.yingxiangxingqiu.com' },
  { name: '大马猴影视', url: 'https://www.damahou.com' },
  { name: '58免费影视', url: 'https://www.58free.com' },
  { name: '硬核指南', url: 'https://www.yinghezhinan.com' },
  { name: 'CCTV节目直播', url: 'https://tv.cctv.com' },
  { name: '免费视频解析', url: 'https://www.jiexi.com' },
  { name: '蓝光影院', url: 'https://www.languang.com' },
  { name: '太乙电影', url: 'https://www.taiyidy.com' },
  { name: '光速影视', url: 'https://www.guangsu.com' },
  { name: '极光影视', url: 'https://www.jiguangys.com' },
  { name: '注视影视', url: 'https://www.zhushiyy.com' },
  { name: '星河影视', url: 'https://www.xingheys.com' },
]

const resources = [
  { name: '吾爱破解', url: 'https://www.52pojie.cn' },
  { name: '小刀娱乐网', url: 'https://www.xiaodao.com' },
  { name: '鸭先知资源网', url: 'https://www.yaxianzhi.com' },
  { name: '乐于分享网', url: 'https://www.leyufenxiang.com' },
  { name: '极简插件', url: 'https://chrome.zzzmh.cn' },
  { name: '画夹插件', url: 'https://huajiakeji.com' },
  { name: 'MSDN', url: 'https://msdn.itellyou.cn' },
  { name: '软仓', url: 'https://www.ruancang.com' },
  { name: '小K网', url: 'https://www.xiaok.com' },
  { name: '佛系软件', url: 'https://www.foxi.com' },
]

const explore = [
  { name: '卡巴斯基网络地图', url: 'https://cybermap.kaspersky.com' },
  { name: 'Radio Garden', url: 'https://radio.garden' },
  { name: '全历史', url: 'https://www.allhistory.com' },
  { name: '国家地理', url: 'https://www.nationalgeographic.com' },
  { name: 'TED', url: 'https://www.ted.com' },
  { name: '纪妖', url: 'https://www.cbaigui.com' },
  { name: '伊甸园', url: 'https://elysium.thebenezer.com' },
  { name: '各类小测试', url: 'https://www.arealme.com' },
]

const gameRes = [
  { name: 'GameFreer资源网', url: 'https://www.gamefreer.com' },
  { name: '梨子乐游戏', url: 'https://www.lizile.com' },
  { name: '免费游戏', url: 'https://www.freegames.com' },
  { name: '掌游网', url: 'https://www.zhangyou.com' },
  { name: 'XDGAME公益版', url: 'https://www.xdgame.com' },
  { name: '哈基米游戏', url: 'https://www.hajimi.com' },
  { name: '小叽资源', url: 'https://www.xiaoji.com' },
  { name: '小鱼资源库', url: 'https://www.xiaoyu.com' },
  { name: '老机库', url: 'https://www.laojiku.com' },
  { name: 'Gamer520', url: 'https://www.gamer520.com' },
]
</script>

<style scoped>
.discover-link {
  display: block;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  transition: all 0.2s ease;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
}
.discover-link:hover {
  color: #ffffff;
  background: rgba(212, 175, 55, 0.25);
  border-color: rgba(212, 175, 55, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
</style>