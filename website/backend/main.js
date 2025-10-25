//import {Auth} from '@supabase/auth-ui-react'
import { createClient } from '@supabase/supabase-js'

const resolveEnv = (key) => {
  if (typeof globalThis === 'undefined') return ''
  const env = globalThis.process?.env ?? {}
  return env[key] ?? ''
}

const supabaseUrl = resolveEnv('SUPABASE_URL')
const supabaseKey = resolveEnv('SUPABASE_KEY')
const supabase = createClient(supabaseUrl, supabaseKey)


document.querySelector("#submit-button").addEventListener("click", sendToSupabase);

async function sendToSupabase() {
    const email = document.querySelector("#email-box").value;
    const password = document.querySelector("#password-box").value;
    console.log("Email:", email);
    console.log("Password:", password);
    // make call to Supabase here
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
  
    if (error) {
      console.error('Supabase sign-up error:', error)
      return
    }
  
    console.log('Supabase sign-up success:', data)
}
