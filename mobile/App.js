import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import Onboard from './routes/Onboard';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [auth, setAuth] = useState(false);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {auth ? (
          <></>
        ) : (
          <Onboard
            setAuth={setAuth}
          />
        )}
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
