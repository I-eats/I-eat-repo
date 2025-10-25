import { Sun02Icon } from "@hugeicons-pro/core-solid-rounded"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { StyleSheet, Text, View, Animated, TouchableOpacity } from "react-native"
import { useEffect, useRef, useState } from "react"

import supabase from "../util/supa"
import { acceptOrderAsDasher, findExistingOrder, updateOrderStatusToDelivered, updateOrderStatusToPickedUp } from "../util/db-store"
import DisplayOrderForDasher from "./components/DisplayOrderForDasher"

export default function DeliverUs({ user }) {
  const rotateValue = useRef(new Animated.Value(0)).current

  const [order, setOrder] = useState(null)
  const [step, setStep] = useState(0)

  // LISTEN TO NEW ORDERS BEING CREATED
  useEffect(() => {
    // CHECK IF THERE IS A CURRENT ORDER FIRST
    const findOrders = async () => {
      const { data, error } = await findExistingOrder()
      if (data) {
        setOrder(data)
        setStep(1)
      } else {
        supabase
          .channel('realtime:orders')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'order' }, payload => {
            console.log('Change received!', payload)

            setOrder(payload.new)
            setStep(1)

            // unsubscribe after getting the first new order
            supabase.removeAllChannels()
          })
          .subscribe()
      }
    }
    findOrders()
  }, [])

  useEffect(() => {
    const startRotation = () => {
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 3000, // 3 seconds for one full rotation
          useNativeDriver: true,
        })
      ).start()
    }

    startRotation()
  }, [rotateValue])

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const handleAcceptOrder = async () => {
    const { error } = await acceptOrderAsDasher({ order_id: order.order_id, dasher_id: user.user_id })
    if (!error) {
      setStep(2)
    } else {
      console.log("Error accepting order: ", error);
    }
  }

  const handleUpdateOrderStatusToPickedUp = async () => {
    const { error } = await updateOrderStatusToPickedUp({ order_id: order.order_id })
    if (!error) {
      setStep(3)
    } else {
      console.log("Error updating order status to picked up: ", error);
    }
  }

  const handleFoodDelivered = async () => {
    const { error } = await updateOrderStatusToDelivered({ order_id: order.order_id })
    if (!error) {
      setStep(0)
      setOrder(null)
    } else {
      console.log("Error updating order status to delivered: ", error);
    }
  }

  return (
    <View style={styles.container}>
      {step === 0 && (
        <View style={styles.content}>
          <Animated.View style={[styles.sunRotating, { transform: [{ rotate: spin }] }]}>
            <HugeiconsIcon
              icon={Sun02Icon}
              size={100}
              color="white"
            />
          </Animated.View>
          <Text style={styles.listeningText}>looking for orders</Text>
        </View>
      )}
      {(step === 1 || step === 2) && (
        <View style={styles.content}>
          {step === 1 && (
            <Text style={styles.listeningText}>order found!</Text>
          )}
          <DisplayOrderForDasher order_id={order?.order_id} />
          {step === 1 ? (
            <TouchableOpacity
              style={styles.acceptButton}
              activeOpacity={0.8}
              onPress={handleAcceptOrder}
            >
              <Text style={styles.acceptButtonText}>accept order</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.acceptButton}
              activeOpacity={0.8}
              onPress={handleUpdateOrderStatusToPickedUp}
            >
              <Text style={styles.acceptButtonText}>Food has been picked up</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {step === 3 && (
        <View style={styles.content}>
          <Text style={styles.listeningText}>You're almost there! Deliver the food to the customer.</Text>
          <TouchableOpacity
            style={styles.acceptButton}
            activeOpacity={0.8}
            onPress={handleFoodDelivered}
          >
            <Text style={styles.acceptButtonText}>Food has been delivered</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
    backgroundColor: "#0ba3ff",
    justifyContent: "center",
    alignItems: "center",
  },
  listeningText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    marginHorizontal: 20,
  },


  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  acceptButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: "#0ba3ff",
    fontSize: 16,
    fontWeight: "600",
  },

  orderContent: {
    padding: 20,    
    width: '100%',

    backgroundColor: "#fff",
    borderRadius: 10,
  }
})