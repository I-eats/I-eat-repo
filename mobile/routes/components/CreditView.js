import { StyleSheet, Text, View } from "react-native"
import { useHolos } from "../../context/HolosProvider"

export default function CreditView() {
  const { creditCount } = useHolos()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>welcome</Text>
      <Text style={styles.subtitle}>you have <Text style={{ color: '#0ba4ff', fontWeight: '800' }}>{creditCount}</Text> credits in your wallet</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'flex-start',

  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 24,
    color: '#999',
    fontWeight: '500',
    marginRight: 100
  }
})