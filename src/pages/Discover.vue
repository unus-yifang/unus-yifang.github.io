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
        <span class="section-title text-sm font-medium tracking-wide">💡 有趣网站</span>
        <span class="section-sub text-[10px]">脑洞 · 创意 · 导航</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in funSites" :key="item.name" :href="item.url" target="_blank" class="discover-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 小说阅读 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">📚 小说阅读</span>
        <span class="section-sub text-[10px]">搜书 · 免费 · 电子书</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in novels" :key="item.name" :href="item.url" target="_blank" class="discover-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 影视娱乐 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">🎬 影视娱乐</span>
        <span class="section-sub text-[10px]">追剧 · 直播 · 解析</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in movies" :key="item.name" :href="item.url" target="_blank" class="discover-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 资源网站 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">📦 学习网站</span>
        <span class="section-sub text-[10px]">学术 · 教育 · 研究</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in resources" :key="item.name" :href="item.url" target="_blank" class="discover-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 全球探索 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">🌍 全球探索</span>
        <span class="section-sub text-[10px]">地理 · 历史 · 文化</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in explore" :key="item.name" :href="item.url" target="_blank" class="discover-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 游戏资源 ===== -->
    <div>
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">🎮 游戏资源</span>
        <span class="section-sub text-[10px]">下载 · 分享 · 单机</span>
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
]

const novels = [
  { name: '鸠摩搜索', url: 'https://www.jiumodiary.com' },
  { name: '资源帝', url: 'https://shu.ziyuandi.cn' },
  { name: '喜欢书签', url: 'https://www.likebookmark.com' },
  { name: '书荒部落', url: 'https://noveless.com' },
  { name: 'txt小说网', url: 'https://www.txtxiaoshuo.com' },
]

const movies = [
  // 国内主流综合视频平台
  { name: '腾讯视频', url: 'https://v.qq.com' }, // 热门剧集、综艺、电影[reference:0][reference:1][reference:2]
  { name: '爱奇艺', url: 'https://www.iqiyi.com' }, // 自制剧、动漫、纪录片[reference:3][reference:4][reference:5]
  { name: '优酷', url: 'https://www.youku.com' }, // 经典影视、独播内容[reference:6][reference:7][reference:8]
  { name: '芒果TV', url: 'https://www.mgtv.com' }, // 芒果综艺、独播剧集[reference:9][reference:10]
  { name: 'Bilibili (B站)', url: 'https://www.bilibili.com' }, // 二次元、UP主创作、纪录片[reference:11][reference:12]
  { name: '搜狐视频', url: 'https://tv.sohu.com' }, // [reference:13][reference:14]
  { name: '乐视视频', url: 'https://www.le.com' }, // [reference:15]

  // 电视台官方平台
  { name: '央视网', url: 'https://www.cctv.com' }, // 中央广播电视总台的新媒体业务平台[reference:16]
  { name: '中国网络电视台', url: 'https://www.cntv.cn' }, // 央视国际网络有限公司主办[reference:17]
  { name: '央视影音', url: 'https://app.cctv.com' }, // 央视官方客户端，支持电视直播[reference:18]
  { name: '央视频', url: 'https://yangshipin.cn' }, // 中央广播电视总台推出的综合性视听新媒体旗舰平台[reference:19]
  { name: 'CCTV-节目官网', url: 'https://tv.cctv.com' }, // 央视各频道节目官网[reference:20]
  { name: 'CCTV-6电影频道', url: 'https://tv.cctv.com/cctv6' }, // 国家电影局负责运营的电影专业频道[reference:21]

  // 短视频与中视频平台
  { name: '抖音', url: 'https://www.douyin.com' }, // [reference:22][reference:23]
  { name: '快手', url: 'https://www.kuaishou.com' }, // [reference:24]
  { name: '西瓜视频', url: 'https://www.ixigua.com' }, // 国内领先的中视频平台[reference:25][reference:26]
  { name: '好看视频', url: 'https://haokan.baidu.com' }, // 百度旗下短视频平台[reference:27]
  { name: '腾讯微视', url: 'https://weishi.qq.com' }, // [reference:28]

  // 其他相关平台
  { name: 'AcFun (A站)', url: 'https://www.acfun.cn' }, // 国内弹幕视频网站[reference:29]
  { name: '土豆网', url: 'https://www.tudou.com' }, // 优酷旗下视频分享网站[reference:30]
]

const resources = [
  { name: '中国知网', url: 'https://www.cnki.net' }, // 国内最大学术数据库[reference:24]
  { name: '万方数据', url: 'https://www.wanfangdata.com.cn' }, // 国内重要学术数据库[reference:25]
  { name: '维普', url: 'http://www.cqvip.com' }, // 国内学术期刊数据库[reference:26]
  { name: '科塔学术', url: 'https://site.sciping.com' }, // 专业学术资源导航[reference:27][reference:28]
  { name: '中国科学院文献情报中心', url: 'http://oa.las.ac.cn' }, // 开放获取学术资源[reference:29]
  { name: '学术资源通道', url: 'https://scholar.edu.cn' }, // 教育网学术资源导航[reference:30]

  // 教育资源
  { name: '国家智慧教育公共服务平台', url: 'https://www.smartedu.cn' }, // 国家级教育平台[reference:31]
  { name: '中国大学MOOC', url: 'https://www.icourse163.org' }, // 国内顶尖大学课程平台[reference:32]
  { name: '学堂在线', url: 'https://www.xuetangx.com' }, // 清华大学发起的学习平台[reference:33]
  { name: '国家基础教育资源网', url: 'http://www.cbern.gov.cn' }, // 国家官方基础教育资源[reference:34]
]

const explore = [
  { name: '站酷', url: 'https://www.zcool.com.cn' }, // 国内最大设计师社区[reference:41]
  { name: '优设导航', url: 'https://hao.shejidaren.com' }, // 设计资源一站式导航[reference:42]
  { name: '千图网', url: 'https://www.58pic.com' }, // 设计素材下载平台[reference:43]
  { name: 'Pixso资源社区', url: 'https://pixso.cn' }, // 设计资源与素材社区[reference:44]
  { name: 'Behance', url: 'https://www.behance.net' }, // 国际知名设计作品展示平台[reference:45]
  { name: '纪妖', url: 'https://www.cbaigui.com' },
  { name: '伊甸园', url: 'https://elysium.thebenezer.com' },
  { name: '极简插件', url: 'https://chrome.zzzmh.cn' },
  { name: '各类小测试', url: 'https://www.arealme.com' },
]

const gameRes = [
  { name: '资源避难所', url: 'https://www.flysheep6.com' }, // 单机游戏资源站[reference:46][reference:47]
  { name: 'Switch520', url: 'https://www.gamer520.com' }, // Switch游戏资源站[reference:48][reference:49]
  { name: 'FitGirl Repacks', url: 'https://fitgirl-repacks.site' }, // 知名游戏高压版资源站
  { name: 'Nexus Mods', url: 'https://www.nexusmods.com' }, // 全球最大游戏模组社区
  { name: '离线啦', url: 'https://lixianla.com' }, // Steam游戏账号分享论坛
]
</script>

<style scoped>
.section-title {
  color: #ffffff !important;
}
.section-sub {
  color: rgba(255, 255, 255, 0.40) !important;
}

.discover-link {
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
.discover-link:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(212, 175, 55, 0.30);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
</style>