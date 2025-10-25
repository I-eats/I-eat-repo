//import {Auth} from '@supabase/auth-ui-react'
import { createClient, auth } from '@supabase/supabase-js'
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY)


document.querySelector("#submit-button").addEventListener("click", sendToSupabase);

async function sendToSupabase() {
    const email = document.querySelector("#email-box").value;
    const password = document.querySelector("#password-box").value;
    console.log("Email:", email);
    console.log("Password:", password);
    // make call to Supabase here
    
    let { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
    })

    
    }