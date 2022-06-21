import React, { useState, useEffect, useCallback } from "react";

// import stylesheets and chat library
import { View, Platform, StyleSheet, KeyboardAvoidingView } from "react-native";
import {
  Bubble,
  GiftedChat,
  SystemMessage,
  Day,
  InputToolbar,
} from "react-native-gifted-chat";

// import firebase for the database
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

//import async storage and netinfo so the app works offline
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

// set firebase configurations
const firebaseConfig = {
  apiKey: "AIzaSyDaT0PhoMpVk-QwVv7tw21FGAHAmpYXYcc",
  authDomain: "chat-app-ef3d5.firebaseapp.com",
  projectId: "chat-app-ef3d5",
  storageBucket: "chat-app-ef3d5.appspot.com",
  messagingSenderId: "593694663825",
  appId: "1:593694663825:web:e50141f5d783b03f824b30",
};

// initialize firebase
const app = initializeApp(firebaseConfig);
// initialize cloud firestore
const db = getFirestore(app);

const auth = getAuth();

export default function Chat(props) {
  // get user name and preferred colour from the props
  let { name, color } = props.route.params;

  // state to hold messages
  const [messages, setMessages] = useState([]);
  // state to hold uid for authentication
  const [uid, setUid] = useState();
  // state to hold user object
  const [user, setUser] = useState({
    _id: "",
    name: "",
    avatar: "",
  });
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
    props.navigation.setOptions({ title: name });
    let unsubscribe;
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }

      authUnsubscribe = onAuthStateChanged(auth, async (user) => {
        // check if there is user and sign in anon if not
        if (!user) {
          await signInAnonymously(auth);
        }

        // set states
        setUid(user.uid);
        setMessages([]);
        setUser({
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        });
      });
    });
    if (isConnected) {
      const messagesQuery = query(
        referenceChatMessages,
        orderBy("createdAt", "desc")
      );
      unsubscribe = onSnapshot(messagesQuery, onCollectionUpdate);
      deleteMessages();
      saveMessages();
      return () => unsubscribe();
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
    });
  };

  // on send, set new message to state and append to the messages collection
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    addMessage(messages[0]);
    saveMessages();
  }, []);

  // updates the state with messages when there is an update
  const onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      console.log(data.user);
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
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

  return (
    <>
      <View style={[{ backgroundColor: color }, styles.container]}>
        <GiftedChat
          style={styles.text}
          renderBubble={renderBubble.bind()}
          renderSystemMessage={renderSystemMessage.bind()}
          renderDay={renderDay.bind()}
          renderInputToolbar={renderInputToolbar.bind()}
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
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