import { StyleSheet, View } from "react-native"
import StoreItemDisplay from "./StoreItemDisplay"
import { useEffect, useState } from "react"
import { getOrderItemsForOrder } from "../../util/db-store"

export default function DisplayOrderForDasher({ order_id }) {
  const [orderItems, setOrderItems] = useState([])

  useEffect(() => {
    const init = async () => {
      const { data, error } = await getOrderItemsForOrder({ order_id })

      if (error) {
        console.log("error getting order items for order: ", error);
        return;
      }

      setOrderItems(data ?? [])
    }

    init()
  }, [order_id])

  return (
    <View style={styles.orderContent}>
      {orderItems.map((item, index) => (
        <StoreItemDisplay 
          key={index} 
          item={item} 
          forced={item?.quantity}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  orderContent: {
    padding: 20,    
    width: '100%',

    backgroundColor: "#fff",
    borderRadius: 10,
  }
})