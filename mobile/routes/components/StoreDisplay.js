import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Avatar from "./Avatar";

import { HugeiconsIcon } from "@hugeicons/react-native";
import { StarIcon } from "@hugeicons-pro/core-solid-rounded";
import { Bookmark02Icon } from "@hugeicons-pro/core-stroke-rounded";

import { useNavigation } from "@react-navigation/native";
import FadeInView from "./FadeInView";

export default function StoreDisplay({ item }) {
  const navigation = useNavigation()

  const handleDisplayPress = () => {
    navigation.navigate('Store', { item });
  }  

  return (
    <FadeInView>
      <TouchableOpacity 
        style={styles.container}
        activeOpacity={0.8}
        onPress={handleDisplayPress}
      >
        <Avatar
          imagePath={item.avatar_path}
          type="store"
          style={styles.image}
        />
        <View style={styles.storeContent}>
          <View style={styles.storeInformation}>
            <Text style={styles.storeName}>{item.store_name}</Text>
            <View style={styles.storeInfo}>
              <Text style={styles.storeRating}>{item.rating}</Text>
              <HugeiconsIcon
                icon={StarIcon}
                size={14}
                color="#ffd017"
              />
              <Text style={styles.storeRatingCount}>({item.rating_count})</Text>
              <Text style={styles.storeDistance}>0.8 mi</Text>
            </View>
            <Text style={styles.storeRating}>$0.49 delivery fee</Text>
          </View>
          <View style={{ paddingTop: 2 }}>
            <HugeiconsIcon
              icon={Bookmark02Icon}
              size={22}
              color="#999"
            />
          </View>
        </View>
      </TouchableOpacity>
    </FadeInView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  image: {
    width: 240,
    height: 150,

    backgroundColor: '#eee',
    borderRadius: 10,
  },

  storeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingHorizontal: 6,
  },

  storeInfo: {
    flexDirection: 'row',
    gap: 5,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  storeRating: {
    fontSize: 14,
    color: '#555',
  },
  storeRatingCount: {
    fontSize: 14,
    color: '#555',
  },
  storeDistance: {
    fontSize: 14,
    color: '#555',
  },
})