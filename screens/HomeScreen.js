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
  const sortUsers = (users) => {
    const usersWhichHaveNewMessage = users.filter((u) => u.hasNewMessage);
    const usersWhichDontHaveNewMessage = users.filter((u) => !u.hasNewMessage);

    return [...usersWhichHaveNewMessage, ...usersWhichDontHaveNewMessage];
  };
  useEffect(() => {
    (async () => {
      const response = await axios.get(`${serverUrl}/users/${user._id}`);
      console.log(response.data);
      const usersDetails = response.data.map((user) => {
        return {
          ...user,
          hasNewMessage: !user.read,
        };
      });
      setUsers(sortUsers(usersDetails));
    })();
  }, []);

  useEffect(() => {
    socket.on("get-message", (data) => {
      const { from, to, msg, roomID } = data;
      setUsers((prev) => {
        const userWhichHasNewMessage = prev.find((user) => user._id === from);
        if (userWhichHasNewMessage) {
          let updatedUsers = prev.filter(
            (u) => u._id !== userWhichHasNewMessage._id
          );
          updatedUsers.unshift({
            ...userWhichHasNewMessage,
            hasNewMessage: true,
          });
          return updatedUsers;
        }
        return prev;
      });
    });

    socket.on("user-created", (u) => {
      if (u._id !== user._id) {
        setUsers((prev) => {
          return [...prev, { ...u, hasNewMessage: false }];
        });
      }
      socket.emit("join", user._id);
    });
  }, []);
  const enterChat = (roomID, email) => {
    socket.emit("update-read", {
      roomID,
      user: user._id,
    });
    setUsers((prev) => {
      return sortUsers(
        prev.map((u) => {
          if (u.email === email) {
            return {
              ...u,
              hasNewMessage: false,
            };
          }
          return u;
        })
      );
    });
    navigation.navigate("Chat", {
      roomID,
      email,
    });
  };
  return (
    <ScrollView>
      {users.map((user, i) => (
        <CustomListItem
          key={i}
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
