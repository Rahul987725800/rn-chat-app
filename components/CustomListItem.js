import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
const CustomListItem = ({ id, email, hasNewMessage = false, enterChat }) => {
  return (
    <ListItem key={id} bottomDivider onPress={enterChat}>
      <Avatar
        rounded
        source={{
          uri: "https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/03/GettyImages-1092658864_hero-1024x575.jpg?w=1155&h=1528",
        }}
      />
      <ListItem.Content>
        <ListItem.Title
          style={{
            fontWeight: "700",
          }}
        >
          {email}
        </ListItem.Title>
        {hasNewMessage && (
          <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
            You have a new message
          </ListItem.Subtitle>
        )}
      </ListItem.Content>
      {hasNewMessage && (
        <TouchableOpacity activeOpacity={0.5}>
          <Ionicons name="notifications" size={24} color="#2C6BED" />
        </TouchableOpacity>
      )}
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({});
