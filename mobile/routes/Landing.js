import { StyleSheet, View } from "react-native";

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import HomePage from "./HomePage";
import LogsPage from "./LogsPage";
import AccountPage from "./AccountPage";

import CartPage from "./CartPage";
import OrderPage from "./OrderPage";

import HolosProvider from "../context/HolosProvider";
import NavigationBar from "./components/NavigationBar";
import StorePage from "./StorePage";

const Stack = createStackNavigator();

export default function Landing() {

  return (
    <View style={styles.container}>
      <HolosProvider>
        <NavigationContainer style={styles.fill}>
          <Stack.Navigator
            style={styles.fill}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen
              name="Home"
              component={HomePage}
              options={{ animation: "none" }}
            />
            <Stack.Screen
              name="Logs"
              component={LogsPage}
              options={{ animation: "none" }}
            />
            <Stack.Screen
              name="Account"
              component={AccountPage}
              options={{ animation: "none" }}
            />

            <Stack.Screen
              name="Store"
              component={StorePage}
              options={{
                animationEnabled: true,
                gestureDirection: "vertical",
                cardStyle: { backgroundColor: "transparent" },
                ...TransitionPresets.ModalSlideFromBottomIOS,
              }}
            />

            <Stack.Screen
              name="Cart"
              component={CartPage}
              options={{
                animationEnabled: true,
                gestureDirection: "vertical",
                cardStyle: { backgroundColor: "transparent" },
                ...TransitionPresets.ModalSlideFromBottomIOS,
              }}
            />
            <Stack.Screen
              name="Order"
              component={OrderPage}
              options={{
                animationEnabled: true,
                gestureDirection: "vertical",
                cardStyle: { backgroundColor: "transparent" },
                ...TransitionPresets.ModalSlideFromBottomIOS,
              }}
            />
          </Stack.Navigator>
          <NavigationBar />
        </NavigationContainer>
      </HolosProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  fill: {
    flex: 1,
    width: '100%',
  }
})