<template>
  <div class="login-container w-full max-w-md mx-auto px-4">
    <div class="login-card rounded-2xl p-8 border">
      <div class="text-center mb-6">
        <div class="text-5xl mb-3">🔑</div>
        <h2 class="text-2xl font-bold text-gray-800">{{ isLogin ? '登录' : '注册' }}</h2>
        <p class="text-gray-500 text-sm mt-1">{{ isLogin ? '登录你的账号' : '创建新账号，赠送 10 U币' }}</p>
      </div>

      <div class="space-y-3">
        <input
          type="email"
          v-model="email"
          placeholder="邮箱"
          class="login-input w-full rounded-lg px-4 py-2.5 outline-none transition"
        />
        <input
          type="text"
          v-if="!isLogin"
          v-model="username"
          placeholder="用户名"
          class="login-input w-full rounded-lg px-4 py-2.5 outline-none transition"
        />
        <input
          type="password"
          v-model="password"
          placeholder="密码（至少6位）"
          class="login-input w-full rounded-lg px-4 py-2.5 outline-none transition"
        />

        <!-- 邮箱限制提示 -->
        <p v-if="!isLogin" class="text-xs text-gray-500 mt-1">
          📧 仅支持 <span class="text-gray-700 font-medium">@qq.com</span>、<span class="text-gray-700 font-medium">@163.com</span> 和 <span class="text-gray-700 font-medium">@126.com</span> 邮箱注册
        </p>

        <button
          class="login-btn w-full py-2.5 rounded-lg font-medium transition mt-2"
          @click="handleSubmit"
        >
          {{ isLogin ? '登录' : '注册' }}
        </button>

        <p
          class="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition text-center"
          @click="toggleMode"
        >
          {{ isLogin ? '还没有账号？去注册' : '已有账号？去登录' }}
        </p>
      </div>
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

<style scoped>
/* ===== 登录卡片（几乎不透明的白色毛玻璃） ===== */
.login-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-color: rgba(255, 255, 255, 0.50);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.06);
}

/* ===== 输入框 ===== */
.login-input {
  background: rgba(255, 255, 255, 0.60);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #1a1a2e;
}
.login-input::placeholder {
  color: rgba(0, 0, 0, 0.30);
}
.login-input:focus {
  border-color: rgba(212, 175, 55, 0.40);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.08);
}

/* ===== 登录按钮 ===== */
.login-btn {
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid rgba(212, 175, 55, 0.20);
  color: #b8860b;
}
.login-btn:hover {
  background: rgba(212, 175, 55, 0.25);
}
</style>