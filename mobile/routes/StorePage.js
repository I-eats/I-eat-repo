import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Avatar from "./components/Avatar";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StarIcon } from "@hugeicons-pro/core-solid-rounded";

import Horizon from "./components/Horizon";
import { useEffect, useState } from "react";
import { getStoreItems } from "../util/db-store";
import StoreItemDisplay from "./components/StoreItemDisplay";

export default function StorePage({ navigation, route }) {
  const { item } = route.params;

  const insets = useSafeAreaInsets();

  const [storeItems, setStoreItems] = useState([]);

  useEffect(() => {
    const init = async () => {
      const { data, error } = await getStoreItems({ store_id: item.store_id });

      if (error) {
        console.log("Error fetching store items", error);
        return;
      }

      setStoreItems(data ?? []);
    }

    init()
  }, []);

  const handleClose = () => {
    navigation.goBack();
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
        style={styles.contentContainer}
      >
        <View style={styles.storeMainPanel}>
          <Avatar
            imagePath={item.avatar_path}
            type="store"
            style={{ height: '100%' }}
          />
        
          <Horizon
            direction={"bottom"}
            color={"#333333"}
            size={200}
            style={styles.gradient}
          />
          <View style={styles.storePanelInfo}>
            <Text style={styles.name}>{item.store_name}</Text>

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
          </View>
        </View>
        <Text style={styles.available}>{storeItems?.length ?? 0} available items</Text>
        <Text style={styles.availableSubtext}>Any available items have been thoroughly vetted for deliciousness.</Text>
        <View style={styles.storeContent}>
          {storeItems.map((storeItem, index) => (
            <StoreItemDisplay item={storeItem} key={`${index}-store-item`} />
          ))}
        </View>

        <View style={{ height: 200 }} />
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
  contentContainer: {
    flex: 1,
    width: '100%',
  },

  storeMainPanel: {
    width: '100%',
    height: 500,
  },

  closeButton: {
    width: 40,
    height: 40,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#eee',
    borderRadius: 20,
  },

  storePanelInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  name: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
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
    color: '#fff',
  },
  storeRatingCount: {
    fontSize: 14,
    color: '#fff',
  },
  storeDistance: {
    fontSize: 14,
    color: '#fff',
  },

  storeContent: {
    flexDirection: 'column',
    padding: 20,
    paddingBottom: 50,
    gap: 20,
  },

  available: {
    fontSize: 23,
    fontWeight: '600',
    color: '#222',
    paddingHorizontal: 20,
    marginTop: 50,
  },
  availableSubtext: {
    fontSize: 16,
    fontWeight: '600',
    color: '#777',
    paddingHorizontal: 20,
    marginTop: 5,
    marginRight: 40,
    marginBottom: 15,
  },
})