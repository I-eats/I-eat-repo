import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useHolos } from "../context/HolosProvider";
import { getCartItemsByStoreItemIds, placeOrder } from "../util/db-store";
import StoreItemDisplay from "./components/StoreItemDisplay";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ShoppingBag01Icon } from "@hugeicons-pro/core-solid-rounded";

export default function CartPage({ navigation }) {
  const insets = useSafeAreaInsets();
  
  const { isViewingCart, setIsViewingCart, cart, setCart, totalItemsInCart, user, setOrder, creditCount, setCreditCount } = useHolos()
  
  const [cartItems, setCartItems] = useState([])
  const [processing, setProcessing] = useState(false)

  const totalCostInCredits = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const quantity = cart[item.store_item_id] ?? 0;
      return acc + (item.credit_price * quantity);
    }, 0);
  }, [cartItems, cart]);

  const totalCostInDollars = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const quantity = cart[item.store_item_id] ?? 0;
      return acc + (item.dollar_price * quantity);
    }, 0);
  }, [cartItems, cart]);
  
  useEffect(() => {
    if (!isViewingCart) setIsViewingCart(true)
    const fetchCartItems = async () => {
      const store_item_ids = Object.entries(cart).filter(([store_item_id, quantity]) => quantity > 0).map(([store_item_id, quantity]) => store_item_id);
      console.log("Fetching cart items for IDs: ", store_item_ids);
      const { data, error } = await getCartItemsByStoreItemIds({ store_item_ids });

      if (error) {
        console.log("Error fetching cart items", error);
        return;
      }

      setCartItems(data ?? []);
    }
    fetchCartItems();

    return () => {
      setIsViewingCart(false)
    }
  }, []);

  const handlePlaceOrder = async () => {
    if (totalCostInCredits > creditCount || processing) return
    setProcessing(true)
    const { data, error } = await placeOrder({
      cart, 
      user_id: user?.user_id, 
      user_credit_id: user?.user_credit_id,
      newCredits: creditCount - totalCostInCredits 
    });

    if (error) {
      console.log("Error placing order: ", error);
      return;
    }

    // update local credit state
    // setUser(prev => ({ ...prev, credit_count: user.credit_count - totalCostInCredits }))
    setCreditCount(prev => prev - totalCostInCredits)

    // update order state
    const currentCart = { ...cart };
    setOrder({
      cart: currentCart,
      details: data.order,
      status: 'pending'
    })

    // clear cart
    setCart({})

    setTimeout(() => {
      navigation.navigate("Order");
    }, 400);
    navigation.goBack()
  }

  return (
    <View style={[styles.container, ]}>
      <ScrollView 
        style={{ width: '100%' }}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 40, flexGrow: 1, paddingTop: insets.top+20 }}
      >
        {totalItemsInCart === 0 
          ? (
            <View style={styles.emptyCart}>
              <HugeiconsIcon
                icon={ShoppingBag01Icon}
                size={80}
                color="#ccc"
              />
              <Text style={styles.emptyText}>Your cart is empty.</Text>
            </View>
          ) 
          : (
            <View style={styles.content}>
              <View style={styles.headingArea}>
                <Text style={{ fontSize: 24, fontWeight: '600' }}>Your Cart</Text>
                <Text style={styles.credits}>{creditCount}</Text>
              </View>
              {cartItems.map((item) => {
                if ((cart[item.store_item_id] ?? 0) === 0) return null;
                return <StoreItemDisplay item={item} key={`cart-item-${item.store_item_id}`} />
              })}

              <View style={styles.orderSummary}>
                <Text style={styles.orderSummaryText}>Order summary</Text>
                <Text style={styles.orderSummaryAmount}>{totalItemsInCart} items</Text>
                <Text style={styles.orderSummaryAmount}>Total: {totalCostInCredits} credits</Text>
                <Text style={styles.orderSummaryAmount}>or ${totalCostInDollars.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={(totalCostInCredits > creditCount) ? 0.4 : 0.8}
                style={[styles.placeOrderButton, totalCostInCredits > creditCount && { opacity: 0.4 }]}
                onPress={handlePlaceOrder}
              >
                <Text style={styles.placeOrderText}>Place order</Text>
              </TouchableOpacity>
            </View>
          )
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#fff',
  },

  content: {
    width: '100%',
    flexGrow: 1,
    flexDirection: 'column',
    gap: 20,

    padding: 20,
  },
  headingArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 20,
  },
  credits: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0ba3ff',
  },


  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },

  orderSummary: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  orderSummaryText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  orderSummaryAmount: {
    fontSize: 18,
    marginBottom: 5,
    color: '#444',
  },

  placeOrderButton: {
    backgroundColor: '#0ba3ff',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
