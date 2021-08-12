import React, { useEffect, useContext } from "react";
import io from "socket.io-client";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import { GlobalContext, GlobalProvider } from "./state/GlobalContext";
const Stack = createStackNavigator();
export const serverUrl = "https://pep-chat.herokuapp.com";
const globalScreenOptions = {
  headerStyle: {
    backgroundColor: "#2C6BED",
  },
  headerTitleStyle: {
    color: "white",
  },
  headerTintColor: "white",
};
export default function App() {
  return (
    <GlobalProvider>
      <Child />
    </GlobalProvider>
  );
}
function Child() {
  const { setSocket } = useContext(GlobalContext);
  useEffect(() => {
    const socket = io(serverUrl);
    socket.on("connect", () => {
      console.log("you connected with id : " + socket.id);
    });
    socket.on("room-joined", (data) => {
      console.log("room-joined");
      console.log(data);
    });

    setSocket(socket);
  }, [setSocket]);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={globalScreenOptions}>
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({});
