import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/main.css'
import { useUserStore } from './stores/user'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// 初始化 Supabase 会话后再挂载
const userStore = useUserStore()
await userStore.init()

app.use(router)
app.mount('#app')