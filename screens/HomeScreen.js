import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomListItem from "../components/CustomListItem";

import { ScrollView } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useContext } from "react";
import { GlobalContext } from "../state/GlobalContext";
const HomeScreen = ({ navigation }) => {
  const { user, socket } = useContext(GlobalContext);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await axios.get(`${serverUrl}/users/${user._id}`);
      console.log(response.data);

      setUsers(
        response.data.map((user) => {
          return {
            ...user,
            hasNewMessage: !user.read,
          };
        })
      );
    })();
  }, []);
  useEffect(() => {
    socket.on("get-message", (data) => {
      const { from, to, msg, roomID } = data;
      setUsers((prev) => {
        return prev.map((user) => {
          if (user._id === from) {
            return {
              ...user,
              hasNewMessage: true,
            };
          }
          return user;
        });
      });
    });
  }, []);
  const enterChat = (roomID, email) => {
    socket.emit("update-read", {
      roomID,
      user: user._id,
    });
    setUsers((prev) => {
      return prev.map((u) => {
        if (u.email === email) {
          return {
            ...u,
            hasNewMessage: false,
          };
        }
        return u;
      });
    });
    navigation.navigate("Chat", {
      roomID,
      email,
    });
  };
  return (
    <ScrollView>
      {users.map((user) => (
        <CustomListItem
          key={user.roomID}
          id={user.roomID}
          email={user.email}
          enterChat={() => {
            enterChat(user.roomID, user.email);
          }}
          hasNewMessage={user.hasNewMessage}
        />
      ))}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
