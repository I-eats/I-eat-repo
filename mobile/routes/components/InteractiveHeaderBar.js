import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MapingIcon, Notification01Icon, ShoppingCart01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Location01SolidRounded } from "@hugeicons-pro/core-solid-rounded";
import GeneralSearchBar from "./GeneralSearchBar";

export default function InteractiveHeaderBar() {
  const insets = useSafeAreaInsets()  

  const handleMapPress = () => {
    console.log('map pressed')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={[styles.top, styles.layer]}>
          <TouchableOpacity 
            style={styles.locationSelector}
            activeOpacity={0.8}
          >
            <HugeiconsIcon
              icon={Location01SolidRounded}
              size={16}
              color="#222"
            />
            <Text style={styles.directionText}>235 S 1st E</Text>
            <Icon name='chevron-down' size={14} color={'#222'} />
          </TouchableOpacity>

          <View style={styles.actionContainer}>
            <HugeiconsIcon
              icon={Notification01Icon}
              size={24}
              color="#222"
            />
            <HugeiconsIcon
              icon={ShoppingCart01Icon}
              size={24}
              color="#222"
            />
          </View>
        </View>
        <View style={[styles.bottom, styles.layer]}>
          <GeneralSearchBar />
          <TouchableOpacity
            style={styles.mapButton}
            activeOpacity={0.8}
            onPress={handleMapPress}
          >
            <HugeiconsIcon
              icon={MapingIcon}
              size={22}
              color="#222"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    width: '100%',
    paddingHorizontal: 20,
  },

  layer: {
    flexDirection: 'row',  
    alignItems: 'center',
    gap: 10,
  },

  locationSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,

    paddingVertical: 20,
  },
  directionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',

    paddingRight: 2,
  },

  actionContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  
  bottom: {
    paddingBottom: 10,
  },
  mapButton: {
    borderRadius: 50,
    padding: 12,
    backgroundColor: '#eee',
  },
})