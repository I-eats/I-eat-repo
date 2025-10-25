import { WorkoutRunIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FadeInView from "./FadeInView";
import { useMemo } from "react";
import { useHolos } from "../../context/HolosProvider";
import { CookBookIcon, EarthIcon, Flag01Icon, GiftIcon, TruckIcon } from "@hugeicons-pro/core-stroke-rounded";

export default function ActiveOrderBar({ navigation }) {
  const { order } = useHolos()

  const stages = [
    { status: 'pending', title: "Finding Deliverer", subtitle: "Looking for a deliverer to pick up your order", icon: EarthIcon, },
    { status: 'accepted', title: "Preparing Food", subtitle: "The restaurant is preparing your food", icon: CookBookIcon, },
    { status: 'picked_up', title: "Out for Delivery", subtitle: "Your deliverer is on the way", icon: TruckIcon, },
    { status: 'delivered', title: "Delivered", subtitle: "Your order has been delivered", icon: GiftIcon, },
  ];

  const currentStage = useMemo(() => {
    const index = stages.findIndex(stage => stage.status === order?.status);
    return stages[index];
  }, [order]);

  const handleOrderChekc = () => {
    navigation.navigate('Order')
  }  

  return (
    <FadeInView>
      <TouchableOpacity 
        style={styles.container}
        activeOpacity={0.8}
        onPress={handleOrderChekc}
      >
        <View style={styles.bar}>
          <HugeiconsIcon
            icon={currentStage?.icon}
            size={24}
            color="#fff"
          />
          <View style={styles.infoCol}>
            <Text style={styles.orderStatus}>{currentStage?.title}</Text>
            <Text style={styles.orderETA}>{currentStage?.subtitle}</Text>
          </View>
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

  infoCol: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
  },
  orderStatus: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  orderETA: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})