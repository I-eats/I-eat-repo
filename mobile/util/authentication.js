import supabase from "./supa";

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
    // create account
    const { error } = await supabase.auth.signUp({ email, password })

    // store user data in user table
    const { data, error: insertError } = await supabase
      .from('user')
      .insert([{ email, password }])

    if (error || insertError) {
      console.log("error creating account: ", error, insertError);
      return { data: null, error: error ?? insertError,  };
    } else {
      console.log("account created successfully: ", data);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      return { data, error };
    }
  }
}

export const checkUserConfirmationStatus = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email: `${email.toLowerCase()}@byui.edu`, password })
  return { data, error };
}

export const getUserInformation = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.log("error getting auth user: ", error);
    return { data: null, error };
  } else {
    const { data, error: selectError } = await supabase
      .from('user')
      .select()
      .eq('email', user.email)
      .single()

    if (selectError) {
      console.log("error getting user information: ", selectError);
      return { data: null, error: selectError };
    } else {
      return { data, error: null };
    }
  }
}

export const getUserCredits = async ({ user_credit_id }) => {
  const { data, error } = await supabase
    .from('user_credit')
    .select('points')
    .eq('user_credit_id', user_credit_id)
    .single()

  if (error) {
    console.log("error getting user credits: ", error);
    return { data: null, error };
  } else {
    return { credit_count: data.points, error: null };
  }
}