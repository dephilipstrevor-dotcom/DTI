import { createClient } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

const valid = /^https?:\/\//i.test(url) && !!anonKey

if (!valid) {
  console.warn('[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing/invalid. Auth & data calls will fail until fixed.')
}

const stub = new Proxy({}, {
  get() {
    return () => {
      throw new Error('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    }
  }
})

export const supabase = valid ? createClient(url, anonKey) : stub
