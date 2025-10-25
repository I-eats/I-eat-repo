import { GiftIcon, Home01Icon, Profile02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHolos } from "../../context/HolosProvider";
import ActiveCartBar from "./ActiveCartBar";
import ActiveOrderBar from "./ActiveOrderBar";

export default function NavigationBar() {
  const insets = useSafeAreaInsets()  
  const navigation = useNavigation();

  const { totalItemsInCart, setIsViewingCart, isViewingCart, isViewingOrder, setIsViewingOrder, order } = useHolos()

  const [selected, setSelected] = useState('Home'); 

  const routes = [
    { name: 'Home', icon: Home01Icon, route: 'HomePage' },
    { name: 'Logs', icon: GiftIcon, route: 'LogsPage' },
    { name: 'Account', icon: Profile02Icon, route: 'AccountPage' },
  ]

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {totalItemsInCart > 0 && !isViewingCart && !order && (
        <ActiveCartBar navigation={navigation} />
      )}
      {order && !isViewingOrder && (
        <ActiveOrderBar navigation={navigation} />
      )}
      <View style={styles.navigation}>
        {routes.map((item, index) => (
          <TouchableOpacity
            key={`${index}-nav`}
            activeOpacity={0.7}
            onPress={() => {
              setSelected(item.name)
              if (totalItemsInCart > 0 && isViewingCart) {
                setIsViewingCart(false)
              }
              if (order && isViewingOrder) {
                setIsViewingOrder(false)
              }
              navigation.navigate(item.name)
            }}
          >
            <HugeiconsIcon
              icon={item.icon}
              size={28}
              color={selected === item.name ? '#222' : '#AAA'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
  },
  navigation: {
    height: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  }
})