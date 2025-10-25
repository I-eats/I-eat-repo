import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import Onboard from './routes/Onboard';
import Landing from './routes/Landing';

export default function App() {
  const [auth, setAuth] = useState(false);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {auth ? (
          <Landing />
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
