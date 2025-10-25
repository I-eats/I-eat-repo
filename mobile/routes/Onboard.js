import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Checkbox } from 'expo-checkbox';
import { accessTheDangWebsite } from "../util/authentication";


export default function Onboard({
  setAuth
}) {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  useEffect(() => {
    if (email.length > 0 && password.length > 0 && termsAccepted) {
      if (!disabled) return;
      setDisabled(false);
    } else {
      if (disabled) return;
      setDisabled(true);
    }
  }, [email, password, termsAccepted]);

  const handleSignIn = async () => {
    if (disabled) return;

    const { data, error } = await accessTheDangWebsite({
      email: `${email}@byui.edu`,
      password: password
    })

    if (error) {
      console.log("error during authentication: ", error);
      return;
    }

    setAuth(data);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>i eat</Text>
        {/* <Text style={styles.subtitle}>The Hogwarts of Student Eating! Get free food for doing well in your classes</Text> */}
      </View>
      <View style={[styles.bottomContent, { paddingBottom: insets.bottom+80 }]}>
        {/* <Text style={styles.bottomTitle}>access your school account</Text> */}
        <View style={styles.emailPortion}>
          <TextInput
            placeholder="sum23003"
            value={email}
            onChangeText={setEmail}
            style={styles.emailInput}
          />
          <Text style={styles.emailEndPortion}>@harvard.edu</Text>
        </View>
        <TextInput
          placeholder="password"
            value={password}
            onChangeText={setPassword}
          style={styles.input}
        />
        <View style={styles.termsWrapper}>
          <View style={styles.termsContainer}>
            <View style={styles.term}>
              <Checkbox 
                style={styles.termCheckbox} 
                value={termsAccepted}
                onValueChange={setTermsAccepted}
              />
              <Text style={styles.termText}>By creating an account, you agree to our <Text style={styles.termLink}>Terms of Service</Text></Text>
            </View>
            <View style={styles.term}>
              <Checkbox 
                style={styles.termCheckbox} 
                value={newsletter}
                onValueChange={setNewsletter}
              />
              <Text style={styles.termText}>I would like to recieve marketing emails and other dumb stuff lol</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.signInButton}
          activeOpacity={0.8}
          onPress={handleSignIn}
        >
          <Text style={styles.buttonText}>create</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#0ba3ff',
  },
  mainContent: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    gap: 20,
    paddingHorizontal: 30,

    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 600,
    textAlign: 'center',
    color: '#fff',

    opacity: 0.8,
  },

  bottomContent: {
    width: '100%',
    paddingVertical: 80,
    paddingHorizontal: 30,

    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: '#fff',

    flexDirection: 'column',
    gap: 20,
  },
  bottomTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0ba3ff',
  },

  emailPortion: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10000,

    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  emailInput: {
    fontSize: 16,
    flex: 1,
  },
  emailEndPortion: {
    fontSize: 16,
    color: '#555',
  },


  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10000,

    paddingHorizontal: 20,
    paddingVertical: 15,

    fontSize: 16,
  },

  signInButton: {
    backgroundColor: '#0ba3ff',
    paddingVertical: 15,
    borderRadius: 10000,
    // marginHorizontal: 60,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  termsWrapper: {
    paddingHorizontal: 20,
  },
  termsContainer: {
    marginTop: 20,
    marginBottom: 20,

    flexDirection: 'column',
    gap: 10,
  },
  term: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 10,
  },
  termCheckbox: {
    marginTop: 3,
  },
  termText: {
    fontSize: 16,
    color: '#555',

    flex: 1,
  },
  termLink: {
    textDecorationLine: 'underline',
    color: '#0ba3ff',
  },

})