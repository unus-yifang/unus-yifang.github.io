<template>
  <div class="page-card">
    <div class="icon-big"><i class="fas fa-right-to-bracket"></i></div>
    <h2>{{ isLogin ? '登录' : '注册' }}</h2>
    <p class="mb-4 text-white/60">{{ isLogin ? '登录你的账号' : '创建新账号，赠送 10 U币' }}</p>
    <div class="w-full max-w-xs mx-auto space-y-3">
      <input type="email" v-model="email" placeholder="邮箱"
             class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 outline-none focus:border-accent/50 transition" />
      <input type="text" v-if="!isLogin" v-model="username" placeholder="用户名"
             class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 outline-none focus:border-accent/50 transition" />
      <input type="password" v-model="password" placeholder="密码（至少6位）"
             class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 outline-none focus:border-accent/50 transition" />
      <button class="mt-2 w-full signin-btn" style="background:rgba(212,175,55,0.2); border-color:#d4af37; color:#d4af37; padding:8px 0;" @click="handleSubmit">
        {{ isLogin ? '登录' : '注册' }}
      </button>
      <p class="text-xs text-white/30 cursor-pointer hover:text-white/60 transition" @click="toggleMode">
        {{ isLogin ? '还没有账号？去注册' : '已有账号？去登录' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const username = ref('')
const isLogin = ref(true)

async function handleSubmit() {
  try {
    if (isLogin.value) {
      await userStore.login(email.value, password.value)
      alert('登录成功')
    } else {
      await userStore.signUp(email.value, password.value, username.value)
      alert('注册成功！已自动登录')
    }
    // 登录成功后，如果有 redirect 参数就跳转过去，否则跳转首页
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  } catch (err) {
    alert(err.message)
  }
}

function toggleMode() {
  isLogin.value = !isLogin.value
  email.value = ''
  password.value = ''
  username.value = ''
}
</script>