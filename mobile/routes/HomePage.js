import { ScrollView, StyleSheet, Text, View } from "react-native";
import CreditView from "./components/CreditView";
import OrderAgain from "./components/OrderAgain";
import PopularView from "./components/PopularView";
import InteractiveHeaderBar from "./components/InteractiveHeaderBar";

export default function HomePage() {
  return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <InteractiveHeaderBar />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <CreditView />

          {/* <OrderAgain /> */}

          <PopularView />
          <PopularView />


          <View style={{ height: 200 }} />
        </ScrollView>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',

    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,

    flexDirection: 'column',
    gap: 45,

  },
});