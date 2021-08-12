import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import axios from "axios";
import { serverUrl } from "../App";
import { useContext } from "react";
import { GlobalContext } from "../state/GlobalContext";
import { useEffect } from "react";
const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const { socket, setUser } = useContext(GlobalContext);
  const signup = async () => {
    console.log("sign up");
    console.log(username);
    try {
      const response = await axios.post(serverUrl + "/user/create", {
        email: username,
      });
      // console.log(response.data);
      setUser(response.data);
      socket.emit("join", response.data._id);

      navigation.replace("Home");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    socket.on("room-joined", (data) => {
      console.log("room-joined");
      console.log(data);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          textContentType="username"
          placeholder="Username"
          autoFocus
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={{
            padding: 10,
          }}
        />
      </View>

      <Button containerStyle={styles.button} title="Signup" onPress={signup} />
    </View>
  );
};

export default SignupScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
