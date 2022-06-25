import React, { useState, useEffect, useCallback } from "react";

// import stylesheets and chat library
import { View, Platform, StyleSheet, KeyboardAvoidingView, Text } from "react-native";
import {
  Bubble,
  GiftedChat,
  SystemMessage,
  Day,
  InputToolbar,
} from "react-native-gifted-chat";

// import firebase for the database
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";

import { auth, db } from '../config/firebase';

//import async storage and netinfo so the app works offline
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

//import custom actions and map view
import CustomActions from "./CustomActions";
import MapView from 'react-native-maps';

export default function Chat(props) {
  // get user name and preferred colour from the props
  let { name, color } = props.route.params;

  // state to hold messages
  const [messages, setMessages] = useState([]);
  // state to hold online/offline state
  const [isConnected, setIsConnected] = useState(false);
  // create reference to messages collection on firestore
  const referenceChatMessages = collection(db, "messages");

  // save messages to local storage
  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messages));
    } catch (e) {
      console.log(error.message);
    }
  };

  // retrieve messages from local storage
  const getMessages = async () => {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      setMessages(JSON.parse(messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  // delete messages from local storage
  const deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (e) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    // set the screen title to the name
    props.navigation.setOptions({ title: name });
    // create variable to hold unsubscriber
    let unsubscribe;

    // check if user is online
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });

    // if user is online, retrieve messages from firebase, if not show the messages in local storage
    if (isConnected) {
      const messagesQuery = query(
        referenceChatMessages,
        orderBy("createdAt", "desc")
      );
      unsubscribe = onSnapshot(messagesQuery, onCollectionUpdate);
      deleteMessages();
      saveMessages();

      return () => {
        unsubscribe();
      };
    } else {
      getMessages();
    }
  }, [isConnected]);

  // append new message to messages collection
  const addMessage = (message) => {
    addDoc(referenceChatMessages, {
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null
    });
  };

  // on send, set new message to state and append to the messages collection
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    addMessage(messages[0]);
  }, []);

  // updates the state with messages when there is an update
  const onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location  || null
      });
    });
    setMessages(messages);
  };

  // customise bubble
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
        }}
      />
    );
  };

  // customise system message
  const renderSystemMessage = (props) => {
    return (
      <SystemMessage {...props} textStyle={{ color: "#fff", fontSize: 14 }} />
    );
  };

  // customise date
  const renderDay = (props) => {
    return <Day {...props} textStyle={{ color: "#fff", fontSize: 14 }} />;
  };

  // customise input to only work if the user is online
  const renderInputToolbar = (props) => {
    if (!isConnected) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  //render the custom actions component next to the input bar so the user can send images and location
  const renderCustomActions = (props) => {
    return <CustomActions {...props} />
  }

  //function to render map view
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if(currentMessage.location) {
      return(
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      )
    }
    return null;
  }

  return (
    <>
      <View style={[{ backgroundColor: color }, styles.container]}>
        <GiftedChat
          style={styles.text}
          renderBubble={renderBubble.bind()}
          renderSystemMessage={renderSystemMessage.bind()}
          renderDay={renderDay.bind()}
          renderActions={renderCustomActions.bind()}
          renderInputToolbar={renderInputToolbar.bind()}
          renderCustomView={renderCustomView}
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: auth?.currentUser?.uid,
          name: name,
          avatar: 'https://placeimg.com/140/140/any'
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});