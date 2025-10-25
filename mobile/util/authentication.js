import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'uhhhhh'
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'uhhhhh'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const accessTheDangWebsite = async ({ email, password }) => {
  // first check if account exists
  const { data, error } = await supabase
    .from('user')
    .select()
    .eq('email', email)

  if (error) {
    console.log("error checking for existing account: ", error);
    return { data: null, error };
  }

  if (data && data?.length > 0) {
    // account exists, try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error };
  } else {
    // account doesn't exist, create it
    //      then authenticate :D

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      console.log("error creating account: ", error);
      return { data: null, error };
    } else {
      console.log("account created successfully: ", data);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      return { data, error };
    }
  }
}