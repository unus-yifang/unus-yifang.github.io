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
        <span class="text-white text-sm font-medium tracking-wide">🤖 AI工具</span>
        <span class="text-white/30 text-[10px]">创作 · 写作 · 编程</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in aiTools" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 设计工具 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="text-white text-sm font-medium tracking-wide">🎨 设计工具</span>
        <span class="text-white/30 text-[10px]">PS · 图标 · 字体</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in designTools" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 图片处理 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="text-white text-sm font-medium tracking-wide">🖼️ 图片处理</span>
        <span class="text-white/30 text-[10px]">去水印 · 抠图 · 图床</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in imageTools" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 办公资源 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="text-white text-sm font-medium tracking-wide">📄 办公资源</span>
        <span class="text-white/30 text-[10px]">PDF · PPT · 文件传输</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in officeTools" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 格式转换 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="text-white text-sm font-medium tracking-wide">🔄 格式转换</span>
        <span class="text-white/30 text-[10px]">转换 · 生成 · 压缩</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in convertTools" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 开发者工具 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="text-white text-sm font-medium tracking-wide">💻 开发者工具</span>
        <span class="text-white/30 text-[10px]">编程 · 数据库 · 社区</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in devTools" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 装机必备 ===== -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2.5">
        <span class="text-white text-sm font-medium tracking-wide">📦 装机必备</span>
        <span class="text-white/30 text-[10px]">日常软件 · 系统工具</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in mustHave" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

    <!-- ===== 装机工具 ===== -->
    <div>
      <div class="flex items-center gap-2 mb-2.5">
        <span class="text-white text-sm font-medium tracking-wide">🔧 装机工具</span>
        <span class="text-white/30 text-[10px]">重装 · 驱动 · 测试</span>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
        <a v-for="item in systemTools" :key="item.name" :href="item.url" target="_blank" class="tool-link">{{ item.name }}</a>
      </div>
    </div>

  </div>
</template>

<script setup>
const aiTools = [
  { name: 'DeepSeek', url: 'https://chat.deepseek.com' },
  { name: '音述AI音乐', url: 'https://www.yinshuai.com' },
  { name: 'AI生成PPT', url: 'https://www.aippt.com' },
  { name: 'AI创作视频', url: 'https://www.aicreator.com' },
  { name: 'AI短剧创作', url: 'https://www.aidrama.com' },
  { name: '超级简历', url: 'https://www.wondercv.com' },
  { name: 'AI写作助手', url: 'https://www.aiwriter.com' },
  { name: 'AI编程', url: 'https://www.aicode.com' },
  { name: '桌面AI助理', url: 'https://www.aidesktop.com' },
  { name: '星流AI', url: 'https://www.xingliuai.com' },
  { name: '蛙蛙AI写作', url: 'https://www.wawaai.com' },
  { name: 'AI简历生成', url: 'https://www.aijianli.com' },
  { name: '蛙蛙AI漫剧', url: 'https://www.wawamanju.com' },
]

const designTools = [
  { name: '在线PS', url: 'https://www.tugaigai.com/online_ps' },
  { name: 'PS精简版', url: 'https://www.jianjieps.com' },
  { name: '奇迹秀工具箱', url: 'https://www.qijixiu.com' },
  { name: '一键抠图', url: 'https://www.remove.bg/zh' },
  { name: 'Iconfont', url: 'https://www.iconfont.cn' },
  { name: '免费商用字体', url: 'https://www.fonts.net.cn' },
  { name: '100Font', url: 'https://www.100font.com' },
  { name: '草料二维码', url: 'https://cli.im' },
  { name: '徽章生成器', url: 'https://shields.io' },
  { name: '免费logo制作', url: 'https://www.logomaker.com' },
  { name: '字体秀', url: 'https://www.fontshow.com' },
]

const imageTools = [
  { name: '在线去水印', url: 'https://www.watermarkremover.io' },
  { name: '免费去水印', url: 'https://www.removewatermark.com' },
  { name: '咖啡AI绘画', url: 'https://www.coffeeai.com' },
  { name: '搜图导航', url: 'https://www.91sotu.com' },
  { name: 'Postimages', url: 'https://postimages.org' },
  { name: '路过图床', url: 'https://imgtu.com' },
  { name: 'ImgBB', url: 'https://imgbb.com' },
  { name: '聚合图床', url: 'https://www.superbed.cn' },
  { name: '图片压缩', url: 'https://tinypng.com' },
  { name: 'AI图片放大', url: 'https://www.upscale.media/zh' },
]

const officeTools = [
  { name: 'PDF24Tools', url: 'https://www.pdf24.org' },
  { name: 'PDF在线工具', url: 'https://www.ilovepdf.com/zh-cn' },
  { name: '第一PPT', url: 'https://www.1ppt.com' },
  { name: '51PPT', url: 'https://www.51ppt.com.cn' },
  { name: '文叔叔传文件', url: 'https://www.wenshushu.cn' },
  { name: 'UC文件传输', url: 'https://www.uc.cn' },
  { name: '局域网传文件', url: 'https://snapdrop.net' },
]

const convertTools = [
  { name: '格式转换器', url: 'https://convertio.co/zh' },
  { name: '文字转语音', url: 'https://www.text-to-speech.com' },
  { name: '短链接生成', url: 'https://dwz.cn' },
  { name: '临时邮箱', url: 'https://www.linshiyouxiang.net' },
  { name: '在线转换', url: 'https://www.online-convert.com' },
  { name: '全能转换', url: 'https://www.aconvert.com/cn' },
  { name: 'CloudConvert', url: 'https://cloudconvert.com' },
]

const devTools = [
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'CSDN', url: 'https://www.csdn.net' },
  { name: '在线JSON', url: 'https://www.sojson.com' },
  { name: '正则测试', url: 'https://regex101.com' },
  { name: 'API测试', url: 'https://www.postman.com' },
  { name: 'Git教程', url: 'https://www.liaoxuefeng.com' },
  { name: 'Node.js', url: 'https://nodejs.org' },
  { name: 'MySQL', url: 'https://www.mysql.com' },
  { name: 'MongoDB', url: 'https://www.mongodb.com' },
  { name: 'Navicat', url: 'https://www.navicat.com' },
  { name: 'Gitee', url: 'https://gitee.com' },
  { name: 'VsCode', url: 'https://code.visualstudio.com' },
  { name: 'Apifox', url: 'https://www.apifox.cn' },
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
  { name: 'PotPlayer', url: 'https://potplayer.daum.net' },
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
  { name: '汽水音乐', url: 'https://www.qishuiyinyue.com' },
  { name: 'Steam', url: 'https://store.steampowered.com' },
  { name: 'WeGame', url: 'https://www.wegame.com.cn' },
  { name: 'Epic', url: 'https://www.epicgames.com' },
]

const systemTools = [
  { name: '图吧工具箱', url: 'https://www.tbtool.cn' },
  { name: '微PE工具箱', url: 'https://www.wepe.com.cn' },
  { name: '硬盘分区助手', url: 'https://www.diskgenius.com' },
  { name: '驱动总裁', url: 'https://www.drivereasy.com' },
  { name: '显卡驱动', url: 'https://www.nvidia.com/drivers' },
  { name: 'CPU驱动', url: 'https://www.intel.com/drivers' },
  { name: '激活工具', url: 'https://github.com/massgravel' },
  { name: '显示器帧率', url: 'https://www.testufo.com' },
  { name: '在线键盘测试', url: 'https://www.keyboardtest.com' },
  { name: '手柄测试', url: 'https://gamepad-tester.com' },
  { name: '鲁大师精简版', url: 'https://www.ludashi.com' },
  { name: '游戏加加', url: 'https://gamepp.com' },
  { name: 'FirPE', url: 'https://www.firpe.cn' },
]
</script>

<style scoped>
.tool-link {
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
.tool-link:hover {
  color: #ffffff;
  background: rgba(212, 175, 55, 0.25);
  border-color: rgba(212, 175, 55, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
</style>