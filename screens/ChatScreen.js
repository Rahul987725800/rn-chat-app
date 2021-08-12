import React from "react";
import { useLayoutEffect, useState, useRef } from "react";
import { useWindowDimensions } from "react-native";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useContext } from "react";
import { GlobalContext } from "../state/GlobalContext";
const ChatScreen = ({ navigation, route }) => {
  const dimensions = useWindowDimensions();
  const roomID = route.params.roomID;
  console.log(roomID);
  const { user, socket } = useContext(GlobalContext);
  const [input, setInput] = useState("");
  const scrollViewRef = useRef();
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    (async () => {
      // console.log(user);
      // console.log(roomID);
      const response = await axios.get(`${serverUrl}/message/${roomID}`);
      // console.log(response.data);
      setMessages(
        response.data.map((message) => {
          return {
            text: message.msg,
            type: message.from === user._id ? "sent" : "received",
          };
        })
      );
    })();
  }, []);
  useEffect(() => {
    socket.on("get-message", (data) => {
      console.log(data);
      const { from, to, msg, roomID } = data;
      setMessages((prev) => [
        ...prev,
        {
          text: msg,
          type: "received",
        },
      ]);
    });
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            rounded
            source={{
              uri: "https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/03/GettyImages-1092658864_hero-1024x575.jpg?w=1155&h=1528",
            }}
          />
          <Text
            style={{
              color: "white",
              marginLeft: 10,
              fontWeight: "600",
              fontSize: 20,
            }}
          >
            {route.params.email}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white"></AntDesign>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);
  const sendMessage = () => {
    const text = input;
    if (text) {
      socket.emit("send-message", {
        from: user._id,
        roomID: roomID,
        msg: text,
      });

      setMessages((prev) => {
        return [...prev, { text, type: "sent" }];
      });

      setInput("");
    }
  };
  const keyboardContainerStyles = () => {
    if (Platform.OS === "web") {
      return {
        height: dimensions.height - 70,
      };
    } else {
      return {
        flex: 1,
      };
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <View style={keyboardContainerStyles()}>
          <View style={{ flex: 15 }}>
            <ScrollView
              style={styles.messages}
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
            >
              {[...messages, { text: "" }].map((message, i) => {
                return (
                  <View style={[styles.message, styles[message.type]]} key={i}>
                    <Text
                      style={{
                        textAlign: message.type === "sent" ? "right" : "left",
                        color: message.type === "sent" ? "white" : "black",
                        padding: 10,
                      }}
                    >
                      {message.text}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          <View style={styles.footer}>
            <TextInput
              placeholder="Message"
              value={input}
              onTouchStart={() => {
                // console.log("touch start");
                setTimeout(() => {
                  scrollViewRef.current.scrollToEnd({ animated: true });
                }, 400);
              }}
              onChangeText={(text) => {
                setInput(text);
              }}
              style={[
                styles.textInput,
                Platform.OS === "web" ? { outlineWidth: 0 } : {},
              ]}
            />
            <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
              <Ionicons name="send" size={24} color="#2B68E6" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  messages: {
    padding: 10,
  },
  message: {
    margin: 5,
    width: "80%",
  },
  received: {
    borderRadius: 10,
    backgroundColor: "#ECECEC",
  },
  sent: {
    borderRadius: 10,
    backgroundColor: "#2C6BED",
    alignSelf: "flex-end",
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#ECECEC",
    color: "gray",
    padding: 10,
    height: 40,
    borderRadius: 30,
    marginRight: 15,
    borderColor: "white",
  },
});
