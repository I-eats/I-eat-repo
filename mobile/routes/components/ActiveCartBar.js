import { ShoppingBag01Icon } from "@hugeicons-pro/core-solid-rounded"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useHolos } from "../../context/HolosProvider"

import FadeInView from "./FadeInView"

export default function ActiveCartBar({ navigation }) {
  const { totalItemsInCart } = useHolos() 


  const handleCheckoutPress = () => {
    navigation.navigate('Cart')
  }

  return (
    <FadeInView style={styles.container}>
      <TouchableOpacity 
        style={styles.bar}
        activeOpacity={0.8}
        onPress={handleCheckoutPress}
      >
        <HugeiconsIcon
          icon={ShoppingBag01Icon}
          size={24}
          color="#fff"
        />
        <Text style={styles.cartText}>Go to checkout</Text>

        <View style={styles.cartContent}>
          <Text style={styles.cartCount}>{totalItemsInCart}</Text>
        </View>
      </TouchableOpacity>
    </FadeInView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,

    position: 'absolute',
    top: -70,
    left: 0,
    zIndex: 10,
  },

  bar: {
    flex: 1,
    marginHorizontal: 20,

    backgroundColor: '#0ba3ff',
    borderRadius: 30,

    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 15,
  },

  cartText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  cartContent: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',

    justifyContent: 'center',
    alignItems: 'center',
  },

  cartCount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
})