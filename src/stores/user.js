import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'
import { getChinaDateString } from '../utils/time'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    profile: null,
    loading: false,
    avatarVersion: 0,
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

    // ===== 头像（从数据库读取主题色） =====
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
        const themeColor = state.profile?.theme_color || '#d4af37'
        bgColor = themeColor.replace('#', '')
      }

      const version = state.avatarVersion || 0
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=fff&size=64&bold=true&v=${version}`
    },

    isSignedInToday: (state) => {
      if (!state.profile?.last_sign_in) return false
      const today = getChinaDateString()
      const lastSign = state.profile.last_sign_in
      return lastSign === today
    },
  },

  actions: {
    refreshAvatar() {
      this.avatarVersion += 1
    },

    async init() {
      this.loading = true
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        this.user = session.user
        await this.fetchProfile()
        this.refreshAvatar()
      }
      this.loading = false
    },

    async fetchProfile() {
      if (!this.user) return
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.user.id)
        .single()
      if (error) {
        console.error('获取资料失败:', error)
      } else {
        this.profile = data
        if (data?.last_sign_in) {
          const today = getChinaDateString()
          if (data.last_sign_in === today) {
            localStorage.setItem('unus_sign_date', today)
          }
        }
        this.refreshAvatar()
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
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('该邮箱尚未验证，请前往邮箱点击验证链接')
        }
        throw error
      }
      this.user = data.user
      await this.fetchProfile()
      this.refreshAvatar()
    },

    async signUp(email, password, username) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      })
      if (error) throw error
      return data
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
      localStorage.removeItem('unus_sign_date')
      this.refreshAvatar()
    },

    // ===== 签到：走 RPC（后端校验日期 + 加币） =====
    async signInDaily() {
      const { data, error } = await supabase.rpc('sign_in_daily')
      if (error) throw new Error(error.message)
      if (!data.success) throw new Error(data.message || '签到失败')

      const today = getChinaDateString()
      if (this.profile) {
        this.profile.ucoins = data.new_balance
        this.profile.last_sign_in = today
      }
      localStorage.setItem('unus_sign_date', today)

      return data.new_balance
    },

    // ===== 扣费：走 RPC（后端校验余额 + 扣减） =====
    async deductCoins(amount) {
      const { data, error } = await supabase.rpc('deduct_coins', { p_amount: amount })
      if (error) throw new Error(error.message)
      if (!data.success) throw new Error(data.message || '扣费失败')

      if (this.profile) {
        this.profile.ucoins = data.new_balance
      }
      return true
    },

    // ===== 设置订阅（仅作兼容保留，实际订阅走 RPC） =====
    async setSubscription(type, days) {
      if (!this.user) throw new Error('请先登录')

      const currentExpires = this.profile?.subscription_expires_at
      const now = new Date()
      let baseDate

      if (currentExpires && new Date(currentExpires) > now) {
        baseDate = new Date(currentExpires)
      } else {
        baseDate = new Date()
      }

      baseDate.setDate(baseDate.getDate() + days)

      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_type: type,
          subscription_expires_at: baseDate.toISOString(),
        })
        .eq('id', this.user.id)
      if (error) throw error
      this.profile.subscription_type = type
      this.profile.subscription_expires_at = baseDate.toISOString()
    },

    // ===== 月卡：走 RPC（后端校验 + 扣费 + 叠加时间） =====
    async subscribeMonthly() {
      const { data, error } = await supabase.rpc('subscribe_plan', { p_type: 'monthly' })
      if (error) throw new Error(error.message)
      if (!data.success) throw new Error(data.message || '订阅失败')

      const today = getChinaDateString()
      const maxFree = 8
      if (this.profile) {
        this.profile.ucoins = data.new_balance
        this.profile.subscription_type = 'monthly'
        this.profile.subscription_expires_at = data.expires_at
        this.profile.ai_free_count = maxFree
        this.profile.ai_free_date = today
      }
      localStorage.setItem('unus_ai_free_date', today)
      localStorage.setItem('unus_ai_free_count', String(maxFree))

      // 同步 AI 免费次数
      await this.updateAIFreeCount(maxFree, today)

      return true
    },

    // ===== 年卡：走 RPC =====
    async subscribeYearly() {
      const { data, error } = await supabase.rpc('subscribe_plan', { p_type: 'yearly' })
      if (error) throw new Error(error.message)
      if (!data.success) throw new Error(data.message || '订阅失败')

      const today = getChinaDateString()
      const maxFree = 20
      if (this.profile) {
        this.profile.ucoins = data.new_balance
        this.profile.subscription_type = 'yearly'
        this.profile.subscription_expires_at = data.expires_at
        this.profile.ai_free_count = maxFree
        this.profile.ai_free_date = today
      }
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

    // ===== 更新主题色 =====
    async updateThemeColor(color) {
      if (!this.user) return
      const { error } = await supabase
        .from('profiles')
        .update({ theme_color: color })
        .eq('id', this.user.id)
      if (error) {
        console.error('保存主题色到数据库失败:', error)
        throw error
      }
      if (this.profile) {
        this.profile.theme_color = color
      }
    },

    // ============================================================
    // ===== 游戏 2048：全部走 RPC（防作弊） =====
    // ============================================================

    // 开始新游戏，返回 session id
    async game2048Start() {
      const { data, error } = await supabase.rpc('game_2048_start')
      if (error) throw new Error(error.message)
      return data
    },

    // 结束游戏，提交分数并领奖
    async game2048Finish(sessionId, score) {
      const { data, error } = await supabase.rpc('game_2048_finish', {
        p_session_id: sessionId,
        p_score: score,
      })
      if (error) throw new Error(error.message)
      if (!data.success) throw new Error(data.message || '结算失败')

      // 同步最新余额、最高分、总积分
      if (this.profile) {
        this.profile.ucoins = data.new_balance
        this.profile.game_2048_best_score = data.best_score
      }
      return data
    },

    // 游戏内扣费（悔棋 1 币，招募 2 币）
    async game2048Spend(amount) {
      const { data, error } = await supabase.rpc('game_2048_spend', { p_amount: amount })
      if (error) throw new Error(error.message)
      if (!data.success) throw new Error(data.message || '扣费失败')

      if (this.profile) {
        this.profile.ucoins = data.new_balance
      }
      return true
    },
  }
})