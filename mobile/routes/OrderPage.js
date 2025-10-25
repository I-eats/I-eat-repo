import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useHolos } from "../context/HolosProvider";
import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { CookBookIcon, EarthIcon, Flag01Icon, GiftIcon, TruckIcon } from "@hugeicons-pro/core-stroke-rounded";


export default function OrderPage({ navigation }) {
  const insets = useSafeAreaInsets();  


const stages = [
  { status: 'pending', title: "Finding Deliverer", subtitle: "Looking for a deliverer to pick up your order", icon: EarthIcon, },
  { status: 'accepted', title: "Preparing Food", subtitle: "The restaurant is preparing your food", icon: CookBookIcon, },
  { status: 'picked_up', title: "Out for Delivery", subtitle: "Your deliverer is on the way", icon: TruckIcon, },
  { status: 'delivered', title: "Delivered", subtitle: "Your order has been delivered", icon: GiftIcon, },
];

  const { order, setOrder, setIsViewingOrder } = useHolos()

  useEffect(() => {
    setIsViewingOrder(true)

    return () => {
      setIsViewingOrder(false)
    }
  }, [])

  const handleClose = () => {
    navigation.goBack();
  }

  const currentStage = useMemo(() => {
    const index = stages.findIndex(stage => stage.status === order?.status);
    return index;
  })

  const handleConfirmDelivery = () => {
    setOrder(null);
    setIsViewingOrder(false);

    navigation.popToTop();
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top+20 }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleClose}

          style={styles.closeButton}
        >
          <Icon name="chevron-down" size={22} color="#888" />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={[styles.contentContainer, { paddingTop: insets.top + 100 }]}
      >
        <Text style={styles.title}>Thank you for your order!</Text>
        <Text style={styles.subtitle}>Your food is on its way</Text>

        <View style={styles.orderStages}>
          {stages.map((stage, index) => (
            <View
              key={`stage-${index}`}
              style={[styles.stageContainer, index === stages.length-1 && { marginBottom: 0 }]}
            >
              <HugeiconsIcon
                icon={stage.icon}
                size={32}
                color={index <= currentStage ? '#0ba3ff' : '#ccc'}
              />
              {index <= currentStage && index !== stages?.length-1 && (
                <View style={styles.continueLine} />
              )}
              <View style={styles.stageInfo}>
                <Text style={[styles.stageTitle, { color: index <= currentStage ? '#222' : '#888' }]}>{stage.title}</Text>
                {/* {index === currentStage && (
                  <Text style={[styles.stageSubtitle, { color: index <= currentStage ? '#555' : '#aaa' }]}>{stage.subtitle}</Text>
                )} */}
                  <Text style={[styles.stageSubtitle, { color: index <= currentStage ? '#555' : '#aaa' }]}>{stage.subtitle}</Text>
              </View>
            </View>
          ))}

        </View>
        {order?.status === 'delivered' && (
          <TouchableOpacity
            style={styles.confirmDeliveryButton}
            activeOpacity={0.8}
            onPress={handleConfirmDelivery}
          >
            <Text style={styles.confirmDeliveryButtonText}>Confirm Delivery</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',

    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,

    overflow: 'hidden',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,

    width: '100%',
    alignItems: 'flex-start',

    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#eee',
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    width: '100%',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
  },

  orderStages: {
    marginTop: 30,
    padding: 10,
    borderRadius: 10,

    backgroundColor: '#eee',
  },
  stageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  stageInfo: {
    marginLeft: 15,
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  stageSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },

  continueLine: {
    position: 'absolute',
    top: 42,
    left: 13,
    width: 4,
    height: 26,
    backgroundColor: '#0ba3ff',

    borderRadius: 2,
  },

  confirmDeliveryButton: {
    marginTop: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#0ba3ff',
    borderRadius: 30,
    alignItems: 'center',
  },
  confirmDeliveryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});