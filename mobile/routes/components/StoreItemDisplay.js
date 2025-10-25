import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Avatar from "./Avatar";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Add01Icon, Remove01Icon } from "@hugeicons-pro/core-solid-rounded";
import { useHolos } from "../../context/HolosProvider";
import FadeInView from "./FadeInView";

export default function StoreItemDisplay({ item, forced=null }) {

  const { cart, setCart, isViewingCart, setIsViewingCart } = useHolos();


  const handleAddToCart = () => {
    setCart(prev => ({
      ...prev,
      [item.store_item_id]: (prev[item.store_item_id] ?? 0) + 1,
    }))

    if (isViewingCart) {
      setIsViewingCart(false);
    }
  }

  const handleRemoveFromCart = () => {
    setCart(prev => {
      const currentQuantity = prev[item.store_item_id] ?? 0;
      if (currentQuantity > 0) {
        return {
          ...prev,
          [item.store_item_id]: currentQuantity - 1,
        };
      }
      return prev;
    });
  }

  return (
    <FadeInView style={styles.container}>
      <View style={styles.card}>
        <Avatar
          imagePath={item.avatar_path}
          type="store_item"
          style={styles.image}
        />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.itemName}>{item.item_name}</Text>
        <Text style={styles.itemPrice}>${item.dollar_price}</Text>
        <Text style={styles.itemCredits}>{item.credit_price}</Text>

        <View style={styles.interactRow}>
          {forced === null && cart[item.store_item_id] > 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={handleRemoveFromCart}
            >
              <HugeiconsIcon
                icon={Remove01Icon}
                size={20}
                color="#555"
              />
            </TouchableOpacity>
          )}
          <Text style={styles.quantityText}>x{forced ?? cart[item.store_item_id] ?? 0}</Text>
          {forced === null && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={handleAddToCart}
            >
              <HugeiconsIcon
                icon={Add01Icon}
                size={20}
                color="#555"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </FadeInView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  card: {
    width: 110,
    height: 110,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: 90,
    height: 90,
  },

  cardInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",

    width: "80%",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },
  itemCredits: {
    fontSize: 14,
    fontWeight: "500",
    color: "#888",
  },

  interactRow: {
    position: "absolute",
    right: 0,
    bottom: 0,

    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  button: {
    padding: 4,
    backgroundColor: "#eee",
    borderRadius: 20,
  }
});