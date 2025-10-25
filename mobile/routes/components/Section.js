import { ScrollView, StyleSheet, Text, View } from "react-native";
import StoreDisplay from "./StoreDisplay";

export default function Section({
  title,
  items=[]
}) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {items.map((item, index) => (
          <StoreDisplay key={index} item={item} />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    gap: 15,
  },
  contentContainer: {
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
    color: '#333',
    paddingLeft: 20,
  }
})