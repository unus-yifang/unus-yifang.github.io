import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://oifrhpfekuocvdjixohc.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('sb_publishable_rcrVQxV4HoJj5zoNUJXPMw_ykHivkTT'),
  },
})