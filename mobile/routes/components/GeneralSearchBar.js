import { Search01Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GeneralSearchBar() {
  const handlePress = () => {
    console.log('searhc thing pressed')
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      activeOpacity={1}
      onPress={handlePress}
    >
      <HugeiconsIcon
        icon={Search01Icon}
        size={20}
        color="#555"
      />
      <Text style={styles.searchText}>Search StudyBites</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#eee',

    flexDirection: 'row',
    gap: 6,

    borderRadius: 50,
    padding: 12,

  }
})