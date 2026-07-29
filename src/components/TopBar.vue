<template>
  <div class="top-bar w-full flex items-center justify-end gap-3 px-4 md:px-6 py-3 flex-shrink-0">
    <!-- U币余额（浅色毛玻璃） -->
    <router-link
      to="/profile"
      class="flex items-center gap-1.5 px-3 h-9 rounded-full glass-light text-gray-700 text-sm font-medium hover:bg-white/30 transition-all duration-200"
    >
      <span class="text-accent">💰</span>
      <span>{{ userStore.ucoins }}</span>
      <span class="text-gray-400 text-xs ml-0.5">U币</span>
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
        class="avatar-top h-9 w-9 rounded-full object-cover border-2 border-white/40 hover:border-white/60 transition-all"
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
  background: rgba(255, 255, 255, 0.55);
  color: rgba(40, 40, 50, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.30);
  cursor: pointer;
  transition: all 0.2s ease;
}
.signin-btn:hover {
  background: rgba(255, 255, 255, 0.75);
}

.avatar-top {
  object-fit: cover;
  cursor: pointer;
  transition: all 0.2s ease;
}
.avatar-top:hover {
  transform: scale(1.06);
  border-color: rgba(255, 255, 255, 0.7);
}
</style>