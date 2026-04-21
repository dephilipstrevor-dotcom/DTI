const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const url = (process.env.SUPABASE_URL || '').trim()
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
const anonKey = (process.env.SUPABASE_ANON_KEY || '').trim()

const isValidUrl = /^https?:\/\//i.test(url)

if (!isValidUrl) {
  console.warn('[supabase] SUPABASE_URL is missing or invalid. Expected "https://<ref>.supabase.co". Backend will start but DB calls will fail until fixed.')
}

const safeCreate = (key) => {
  if (!isValidUrl || !key) {
    return new Proxy({}, {
      get() {
        throw new Error('Supabase client not configured. Set SUPABASE_URL (https://...), SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_ANON_KEY.')
      }
    })
  }
  return createClient(url, key)
}

const supabase = safeCreate(serviceKey)
const supabaseAuth = safeCreate(anonKey)

module.exports = { supabase, supabaseAuth }
