// import { Auth } from '@supabase/auth-ui-react'
// import { ThemeSupa } from '@supabase/auth-ui-shared'
// import { createClient } from '@supabase/supabase-js'
// import './App.css'

// // Vite uses import.meta.env instead of process.env
// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// )

// function App() {
//   return (
//     <div className="App">
//       <h1>Supabase Auth Demo</h1>
//       <Auth
//         supabaseClient={supabase}
//         appearance={{ theme: ThemeSupa }}
//         theme="dark"
//       />
//     </div>
//   )
// }

// export default App

import { useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@supabase/supabase-js'
import './App.css'


function App() {
  useEffect(() => {
    const testConnection = async () => {
      console.log('Testing Supabase connection...')

      // ✅ Make sure these are prefixed with VITE_ in .env.local
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)


      // // simple query to check if it works
      // const { data, error } = await supabase.from('user').select().limit(1)
      // if (error) {
      //   console.error('❌ Supabase connection failed:', error.message)
      // } else {
      //   console.log('✅ Supabase connected! Example data:', data)
      // }

      const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password
          })
    }

    testConnection()
  }, [])

  return (
    <div className="App">
      <h1>Supabase Auth Demo</h1>
      {/* <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
      /> */}
    </div>
  )
}

export default App
