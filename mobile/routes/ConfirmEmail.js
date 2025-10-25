import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { checkUserConfirmationStatus } from "../util/authentication";

export default function ConfirmEmail({
  setAuth,
  email,
  password,
}) {
  useEffect(() => {
    const checkItTimeout = setInterval(() => {
      handleCheckConfirmation();
    }, 5000);

    return () => clearTimeout(checkItTimeout);
  }, [email, password])

  const handleCheckConfirmation = async () => {
    console.log('checking now!!!!')
    const { data, error } = await checkUserConfirmationStatus({ email, password });

    if (error) {
      console.log("error checking confirmation status: ", JSON.stringify(error));
    } else {
      if (data?.user?.email_confirmed_at) {
        console.log("email confirmed!");
        // setConfirmationNecessary(false);
        setAuth(data);
      } else {
        console.log("email not yet confirmed.");
      } 
    }
  }
  
  return (
    <View style={styles.container}>
      <Text>Please confirm your email to continue.</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleCheckConfirmation}
      >
        <Text>CHECK AGAIN SUCKER!!!!</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  }
})