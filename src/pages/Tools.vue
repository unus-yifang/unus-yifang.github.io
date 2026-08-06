<template>
  <div class="tools-container w-full max-w-6xl mx-auto px-4 py-6">

    <div class="text-center mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-white drop-shadow-lg tracking-tight">
        🔧 工具集
      </h1>
      <p class="text-white/50 text-sm mt-1">精选实用工具 · 点击即用</p>
    </div>

    <!-- ===== AI工具 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">🤖 AI工具</span>
        <span class="section-sub text-[10px]">创作 · 写作 · 编程</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in aiTools" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 设计工具 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">🎨 设计工具</span>
        <span class="section-sub text-[10px]">PS · 图标 · 字体</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in designTools" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 图片处理 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">🖼️ 图片处理</span>
        <span class="section-sub text-[10px]">去水印 · 抠图 · 图床</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in imageTools" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 办公资源 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">📄 办公资源</span>
        <span class="section-sub text-[10px]">PDF · PPT · 文件传输</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in officeTools" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 格式转换 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">🔄 格式转换</span>
        <span class="section-sub text-[10px]">转换 · 生成 · 压缩</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in convertTools" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 开发者工具 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">💻 开发者工具</span>
        <span class="section-sub text-[10px]">编程 · 数据库 · 社区</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in devTools" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 装机必备 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">📦 装机必备</span>
        <span class="section-sub text-[10px]">日常软件 · 系统工具</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in mustHave" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 装机工具 ===== -->
    <div>
      <div class="flex items-center gap-2 mb-2.5">
        <span class="section-title text-sm font-medium tracking-wide">🔧 装机工具</span>
        <span class="section-sub text-[10px]">重装 · 驱动 · 测试</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in systemTools" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

  </div>
</template>

<script setup>
// ===== 工具数据 =====
const aiTools = [
  { name: 'ChatGPT', url: 'https://chatgpt.com' }, // OpenAI[reference:0][reference:1]
  { name: 'Claude', url: 'https://claude.ai' }, // Anthropic[reference:2][reference:3]
  { name: 'Gemini', url: 'https://gemini.google.com' }, // Google[reference:4][reference:5]
  { name: 'DeepSeek', url: 'https://chat.deepseek.com' }, // 深度求索[reference:6][reference:7]
  { name: 'Kimi', url: 'https://www.kimi.com' }, // 月之暗面[reference:8][reference:9]
  { name: '豆包', url: 'https://www.doubao.com' }, // 字节跳动[reference:10][reference:11]
  { name: '通义千问', url: 'https://tongyi.aliyun.com/qianwen' }, // 阿里云[reference:12][reference:13]
  { name: '文心一言', url: 'https://yiyan.baidu.com' }, // 百度[reference:14][reference:15]
  { name: '智谱清言', url: 'https://chatglm.cn' }, // 智谱AI[reference:16][reference:17]
  { name: '讯飞星火', url: 'https://xinghuo.xfyun.cn' }, // 科大讯飞[reference:18][reference:19]
  { name: '腾讯元宝', url: 'https://yuanbao.tencent.com' }, // 腾讯[reference:20][reference:21]
  { name: 'Perplexity', url: 'https://www.perplexity.ai' }, // 问答引擎[reference:22][reference:23]
  { name: 'Grok', url: 'https://grok.com' }, // xAI[reference:24]
  { name: 'Poe', url: 'https://poe.com' }, // Quora聚合平台[reference:25]
  { name: '天工AI', url: 'https://www.tiangong.cn' }, // 昆仑万维[reference:26][reference:27]
]

const designTools = [
  { name: '在线PS', url: 'https://www.tugaigai.com/online_ps' },
  { name: '一键抠图', url: 'https://www.remove.bg/zh' },
  { name: 'Iconfont', url: 'https://www.iconfont.cn' },
  { name: '免费商用字体', url: 'https://www.fonts.net.cn' },
  { name: '100Font', url: 'https://www.100font.com' },
  { name: '草料二维码', url: 'https://cli.im' },
  { name: '徽章生成器', url: 'https://shields.io' },
  { name: '字体秀', url: 'https://www.fontshow.com' },
]

const imageTools = [
  { name: '在线去水印', url: 'https://www.watermarkremover.io' },
  { name: '搜图导航', url: 'https://www.91sotu.com' },
  { name: 'unsplash', url: 'https://unsplash.com/' },
]

const officeTools = [
  { name: 'PDF24Tools', url: 'https://www.pdf24.org' },
  { name: 'PDF在线工具', url: 'https://www.ilovepdf.com/zh-cn' },
  { name: '第一PPT', url: 'https://www.1ppt.com' },
  { name: '文叔叔传文件', url: 'https://www.wenshushu.cn' },
  { name: '局域网传文件', url: 'https://snapdrop.net' },
]

const convertTools = [
  { name: '格式转换器', url: 'https://convertio.co/zh' },
  { name: '在线转换', url: 'https://www.online-convert.com' },
  { name: '全能转换', url: 'https://www.aconvert.com/cn' },
  { name: 'CloudConvert', url: 'https://cloudconvert.com' },
]

const devTools = [
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'CSDN', url: 'https://www.csdn.net' },
  { name: '在线JSON', url: 'https://www.sojson.com' },
  { name: 'API测试', url: 'https://www.postman.com' },
  { name: 'Node.js', url: 'https://nodejs.org' },
  { name: 'VsCode', url: 'https://code.visualstudio.com' },
]

const mustHave = [
  { name: 'QQ', url: 'https://im.qq.com' },
  { name: '微信', url: 'https://weixin.qq.com' },
  { name: '钉钉', url: 'https://www.dingtalk.com' },
  { name: '飞书', url: 'https://www.feishu.cn' },
  { name: 'WPS', url: 'https://www.wps.cn' },
  { name: 'Office', url: 'https://www.microsoft.com/office' },
  { name: 'Bandizip', url: 'https://www.bandisoft.com/bandizip' },
  { name: '7-Zip', url: 'https://www.7-zip.org' },
  { name: 'Everything', url: 'https://www.voidtools.com' },
  { name: '火绒安全', url: 'https://www.huorong.cn' },
  { name: '360驱动', url: 'https://www.360.cn' },
  { name: '迅雷12', url: 'https://www.xunlei.com' },
  { name: '搜狗输入法', url: 'https://shurufa.sogou.com' },
  { name: '微信输入法', url: 'https://type.weixin.qq.com' },
  { name: 'Edge', url: 'https://www.microsoft.com/edge' },
  { name: 'Chrome', url: 'https://www.google.com/chrome' },
  { name: 'Firefox', url: 'https://www.mozilla.org/firefox' },
  { name: '夸克PC浏览器', url: 'https://www.quark.cn' },
  { name: '网易云音乐', url: 'https://music.163.com' },
  { name: 'QQ音乐', url: 'https://y.qq.com' },
  { name: '酷狗音乐', url: 'https://www.kugou.com' },
  { name: 'Steam', url: 'https://store.steampowered.com' },
  { name: 'WeGame', url: 'https://www.wegame.com.cn' },
  { name: 'Epic', url: 'https://www.epicgames.com' },
]

const systemTools = [
  { name: '图吧工具箱', url: 'https://www.tbtool.cn' },
  { name: '微PE工具箱', url: 'https://www.wepe.com.cn' },
  { name: '鲁大师', url: 'https://www.ludashi.com' },
]
</script>

<style scoped>
/* ===== 分类标题（保持白色） ===== */
.section-title {
  color: #ffffff !important;
}
.section-sub {
  color: rgba(255, 255, 255, 0.40) !important;
}

/* ===== 卡片链接 ===== */
.tool-link {
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
.tool-link:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(212, 175, 55, 0.30);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
</style>