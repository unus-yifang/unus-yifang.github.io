import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    profile: null,
    loading: false,
  }),

  getters: {
    // ===== 登录状态 =====
    isLoggedIn: (state) => !!state.user,

    // ===== 用户名 =====
    username: (state) => state.profile?.username || '未登录',

    // ===== U币余额 =====
    ucoins: (state) => state.profile?.ucoins || 0,

    // ===== 订阅类型（原始值） =====
    subscriptionType: (state) => state.profile?.subscription_type || 'free',

    // ===== 订阅到期时间 =====
    subscriptionExpiresAt: (state) => state.profile?.subscription_expires_at || null,

    // ===== 订阅是否在有效期内 =====
    subscriptionIsActive: (state) => {
      if (!state.profile?.subscription_expires_at) return false
      return new Date(state.profile.subscription_expires_at) > new Date()
    },

    // ===== 有效订阅类型：'free' | 'monthly' | 'yearly' =====
    effectiveSubscription: (state) => {
      const type = state.profile?.subscription_type || 'free'
      const expires = state.profile?.subscription_expires_at
      if (!expires) return 'free'
      if (new Date(expires) <= new Date()) return 'free'
      return type === 'monthly' || type === 'yearly' ? type : 'free'
    },

    // ===== 订阅展示文字 =====
    subscriptionDisplay: (state) => {
      const sub = state.effectiveSubscription
      if (sub === 'yearly') return '✨ 年卡会员'
      if (sub === 'monthly') return '⭐ 月卡会员'
      return '免费用户'
    },

    // ===== 订阅状态颜色 =====
    subscriptionStatusColor: (state) => {
      const sub = state.effectiveSubscription
      if (sub === 'yearly') return 'text-amber-400 border-amber-400/30 bg-amber-400/10'
      if (sub === 'monthly') return 'text-blue-400 border-blue-400/30 bg-blue-400/10'
      return 'text-white/40 border-white/10 bg-white/5'
    },

    // ===== 头像（免费灰色，付费主题色） =====
    avatar: (state) => {
      if (!state.user || !state.profile?.username) {
        // 未登录：灰色
        return 'https://ui-avatars.com/api/?name=?&background=6b7280&color=fff&size=64&font-size=0.5&bold=true'
      }
      
      const name = state.profile.username
      const sub = state.effectiveSubscription
      
      let bgColor
      if (sub === 'free') {
        // 免费用户：灰色
        bgColor = '6b7280'
      } else {
        // 付费用户：使用主题色，默认金色 #d4af37
        bgColor = localStorage.getItem('unus_theme_color')?.replace('#', '') || 'd4af37'
      }
      
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=fff&size=64&bold=true`
    },
  },

  actions: {
    // ===== 初始化：恢复会话 =====
    async init() {
      this.loading = true
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        this.user = session.user
        await this.fetchProfile()
      }
      this.loading = false
    },

    // ===== 获取个人资料 =====
    async fetchProfile() {
      if (!this.user) return
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.user.id)
        .single()
      if (error) console.error('获取资料失败:', error)
      else this.profile = data
    },

    // ===== 更新 AI 免费次数到数据库 =====
    async updateAIFreeCount(count, date) {
      if (!this.user) return
      const { error } = await supabase
        .from('profiles')
        .update({ 
          ai_free_count: count,
          ai_free_date: date 
        })
        .eq('id', this.user.id)
      if (error) {
        console.error('更新AI免费次数失败:', error)
        throw error
      }
      if (this.profile) {
        this.profile.ai_free_count = count
        this.profile.ai_free_date = date
      }
    },

    // ===== 登录 =====
    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      this.user = data.user
      await this.fetchProfile()
    },

    // ===== 注册 =====
    async signUp(email, password, username) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      })
      if (error) throw error
      if (data.user) {
        this.user = data.user
        await this.fetchProfile()
      }
    },

    // ===== 退出登录 =====
    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
    },

    // ===== 每日签到：+1 U币 =====
    async signInDaily() {
      if (!this.user) throw new Error('请先登录')
      const today = new Date().toDateString()
      const lastSign = localStorage.getItem('unus_sign_date')
      if (lastSign === today) throw new Error('今天已签到')

      const newCoins = (this.profile?.ucoins || 0) + 1
      const { error } = await supabase
        .from('profiles')
        .update({ ucoins: newCoins, last_sign_in: new Date().toISOString().split('T')[0] })
        .eq('id', this.user.id)
      if (error) throw error

      this.profile.ucoins = newCoins
      localStorage.setItem('unus_sign_date', today)
      return newCoins
    },

    // ===== 扣除 U币 =====
    async deductCoins(amount) {
      if (!this.user) throw new Error('请先登录')
      if ((this.profile?.ucoins || 0) < amount) throw new Error('U币不足')

      const newCoins = this.profile.ucoins - amount
      const { error } = await supabase
        .from('profiles')
        .update({ ucoins: newCoins })
        .eq('id', this.user.id)
      if (error) throw error
      this.profile.ucoins = newCoins
      return true
    },

    // ===== 设置订阅（管理员使用） =====
    async setSubscription(type, days) {
      if (!this.user) throw new Error('请先登录')
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + days)

      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_type: type,
          subscription_expires_at: expiresAt.toISOString(),
        })
        .eq('id', this.user.id)
      if (error) throw error
      this.profile.subscription_type = type
      this.profile.subscription_expires_at = expiresAt.toISOString()
    },

    // ===== 购买月卡（68 U币 / 30天） =====
    async subscribeMonthly() {
      if (!this.user) throw new Error('请先登录')
      if (this.effectiveSubscription === 'monthly') throw new Error('已是月卡会员')
      if (this.effectiveSubscription === 'yearly') throw new Error('已是年卡会员，无需重复订阅')

      await this.deductCoins(68)
      await this.setSubscription('monthly', 30)
      return true
    },

    // ===== 购买年卡（648 U币 / 365天） =====
    async subscribeYearly() {
      if (!this.user) throw new Error('请先登录')
      if (this.effectiveSubscription === 'yearly') throw new Error('已是年卡会员')

      await this.deductCoins(648)
      await this.setSubscription('yearly', 365)
      return true
    },

    // ===== 更新自定义链接 =====
    async updateCustomLinks(links) {
      if (!this.user) throw new Error('请先登录')
      const { error } = await supabase
        .from('profiles')
        .update({ custom_links: links })
        .eq('id', this.user.id)
      if (error) throw error
      this.profile.custom_links = links
    },

    // ===== 更新壁纸偏好 =====
    async updateWallpaper(preference, url, theme, color) {
      if (!this.user) throw new Error('请先登录')
      const updates = { wallpaper_preference: preference }
      if (url !== undefined) updates.wallpaper_url = url
      if (theme !== undefined) updates.wallpaper_theme = theme
      if (color !== undefined) updates.wallpaper_color = color
      const { error } = await supabase.from('profiles').update(updates).eq('id', this.user.id)
      if (error) throw error
      Object.assign(this.profile, updates)
    },
  }
})