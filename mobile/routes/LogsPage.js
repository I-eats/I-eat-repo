import { ScrollView, StyleSheet, Text, View } from "react-native";
import CreditView from "./components/CreditView";

export default function LogsPage() {
  return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <CreditView />

      </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',

    backgroundColor: '#f0f',
  },
  contentContainer: {
    flexGrow: 1,
  },
});