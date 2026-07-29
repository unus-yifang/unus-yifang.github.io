import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    profile: null,
    loading: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    username: (state) => state.profile?.username || '未登录',
    ucoins: (state) => state.profile?.ucoins || 0,
    subscriptionType: (state) => state.profile?.subscription_type || 'free',
    subscriptionExpiresAt: (state) => state.profile?.subscription_expires_at || null,
    subscriptionIsActive: (state) => {
      if (!state.profile?.subscription_expires_at) return false
      return new Date(state.profile.subscription_expires_at) > new Date()
    },
    effectiveSubscription: (state) => {
      const type = state.profile?.subscription_type || 'free'
      const expires = state.profile?.subscription_expires_at
      if (!expires) return 'free'
      if (new Date(expires) <= new Date()) return 'free'
      return type === 'monthly' || type === 'yearly' ? type : 'free'
    },
    subscriptionDisplay: (state) => {
      const sub = state.effectiveSubscription
      if (sub === 'yearly') return '✨ 年卡会员'
      if (sub === 'monthly') return '⭐ 月卡会员'
      return '免费用户'
    },
    subscriptionStatusColor: (state) => {
      const sub = state.effectiveSubscription
      if (sub === 'yearly') return 'text-amber-400 border-amber-400/30 bg-amber-400/10'
      if (sub === 'monthly') return 'text-blue-400 border-blue-400/30 bg-blue-400/10'
      return 'text-white/40 border-white/10 bg-white/5'
    },
    avatar: (state) => {
      if (!state.user || !state.profile?.username) {
        return 'https://ui-avatars.com/api/?name=?&background=6b7280&color=fff&size=64&font-size=0.5&bold=true'
      }
      const name = state.profile.username
      const sub = state.effectiveSubscription
      let bgColor
      if (sub === 'free') {
        bgColor = '6b7280'
      } else {
        bgColor = localStorage.getItem('unus_theme_color')?.replace('#', '') || 'd4af37'
      }
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=fff&size=64&bold=true`
    },
  },

  actions: {
    async init() {
      this.loading = true
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        this.user = session.user
        await this.fetchProfile()
      }
      this.loading = false
    },

    // ===== 修复：获取资料后同步签到状态到 localStorage =====
    async fetchProfile() {
      if (!this.user) return
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.user.id)
        .single()
      if (error) console.error('获取资料失败:', error)
      else {
        this.profile = data
        // 同步签到状态：如果 last_sign_in 是今天，写入 localStorage
        if (data?.last_sign_in) {
          const today = new Date().toISOString().split('T')[0]
          const lastSignDate = new Date(data.last_sign_in).toISOString().split('T')[0]
          if (lastSignDate === today) {
            localStorage.setItem('unus_sign_date', today)
          }
        }
      }
    },

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

    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      this.user = data.user
      await this.fetchProfile()
    },

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

    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
      localStorage.removeItem('unus_sign_date')
    },

    // ===== 修复：签到成功后同时更新 localStorage =====
    async signInDaily() {
      if (!this.user) throw new Error('请先登录')
      
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('last_sign_in, ucoins')
        .eq('id', this.user.id)
        .single()
      
      if (fetchError) throw fetchError
      
      const today = new Date().toISOString().split('T')[0]
      const lastSignIn = profile?.last_sign_in ? new Date(profile.last_sign_in).toISOString().split('T')[0] : null
      
      if (lastSignIn === today) {
        throw new Error('今天已签到')
      }

      const newCoins = (profile?.ucoins || 0) + 1
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          ucoins: newCoins, 
          last_sign_in: new Date().toISOString().split('T')[0] 
        })
        .eq('id', this.user.id)
      
      if (updateError) throw updateError

      this.profile.ucoins = newCoins
      this.profile.last_sign_in = new Date().toISOString().split('T')[0]
      localStorage.setItem('unus_sign_date', today)
      
      return newCoins
    },

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

    async subscribeMonthly() {
      if (!this.user) throw new Error('请先登录')
      if (this.effectiveSubscription === 'monthly') throw new Error('已是月卡会员')
      if (this.effectiveSubscription === 'yearly') throw new Error('已是年卡会员，无需重复订阅')

      await this.deductCoins(68)
      await this.setSubscription('monthly', 30)

      const today = new Date().toISOString().split('T')[0]
      const maxFree = 8
      this.profile.ai_free_count = maxFree
      this.profile.ai_free_date = today
      localStorage.setItem('unus_ai_free_date', today)
      localStorage.setItem('unus_ai_free_count', String(maxFree))
      await this.updateAIFreeCount(maxFree, today)

      return true
    },

    async subscribeYearly() {
      if (!this.user) throw new Error('请先登录')
      if (this.effectiveSubscription === 'yearly') throw new Error('已是年卡会员')

      await this.deductCoins(648)
      await this.setSubscription('yearly', 365)

      const today = new Date().toISOString().split('T')[0]
      const maxFree = 20
      this.profile.ai_free_count = maxFree
      this.profile.ai_free_date = today
      localStorage.setItem('unus_ai_free_date', today)
      localStorage.setItem('unus_ai_free_count', String(maxFree))
      await this.updateAIFreeCount(maxFree, today)

      return true
    },

    async updateCustomLinks(links) {
      if (!this.user) throw new Error('请先登录')
      const { error } = await supabase
        .from('profiles')
        .update({ custom_links: links })
        .eq('id', this.user.id)
      if (error) throw error
      this.profile.custom_links = links
    },

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