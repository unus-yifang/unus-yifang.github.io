<template>
  <div class="top-bar w-full flex items-center justify-end gap-3 px-4 md:px-6 py-3 flex-shrink-0">

    <!-- U币余额（文字黑色） -->
    <router-link
      to="/profile"
      class="flex items-center gap-1.5 px-3 h-9 rounded-full glass-light text-gray-900 text-sm font-medium hover:bg-white/30 transition-all duration-200"
    >
      <span class="text-accent">💰</span>
      <span>{{ userStore.ucoins }}</span>
      <span class="text-gray-500 text-xs ml-0.5">U币</span>
    </router-link>

    <!-- 签到 -->
    <button class="signin-btn h-9 px-4" @click="handleSignin">
      <i class="fas fa-calendar-check mr-1"></i> 签到
    </button>

    <!-- 头像 -->
    <router-link to="/profile">
      <img
        :src="userStore.avatar"
        alt="avatar"
        class="avatar-top h-9 w-9 rounded-full object-cover border-2 border-white/40 hover:border-gray-300 transition-all"
        @error="handleAvatarError"
        ref="avatarImg"
      />
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const avatarImg = ref(null)

function handleAvatarError(event) {
  event.target.src = 'https://ui-avatars.com/api/?name=?&background=6b7280&color=fff&size=64&font-size=0.5&bold=true'
}

async function handleSignin() {
  try {
    const newCoins = await userStore.signInDaily()
    alert(`签到成功！+1 U币，当前余额：${newCoins} U币`)
  } catch (err) {
    alert(err.message)
  }
}
</script>

<style scoped>
.signin-btn {
  min-width: 80px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.60);
  color: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.30);
  cursor: pointer;
  transition: all 0.2s ease;
}
.signin-btn:hover {
  background: rgba(255, 255, 255, 0.85);
}

.avatar-top {
  object-fit: cover;
  cursor: pointer;
  transition: all 0.2s ease;
}
.avatar-top:hover {
  transform: scale(1.06);
  border-color: rgba(0, 0, 0, 0.20);
}

.glass-light {
  background: rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.40);
}
</style>