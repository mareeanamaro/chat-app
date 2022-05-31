import React, { useState, useEffect, useCallback }  from "react";
import { View, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';

import { Bubble, GiftedChat, SystemMessage, Day } from "react-native-gifted-chat";

export default function Chat(props) {

    let { name, color } = props.route.params;
    useEffect(() =>     props.navigation.setOptions ({ title: name}))

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages([
          {
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'React Native',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },
          {
            _id: 2,
            text: `${name} has entered the chat.`,
            createdAt: new Date(),
            system: true,
           },
        ])
      }, [])

      const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
      }, [])

      const renderBubble = (props) => {
            return (
                <Bubble 
                  {... props}
                  wrapperStyle = {
                      {
                          right: {
                              backgroundColor: '#000'
                          }
                      }
                  }/>
            )
      }
 
      const renderSystemMessage= (props) => {
        return (
            <SystemMessage
                {...props} textStyle={{ color: '#fff', fontSize: 14 }} />
        );
    }


    const renderDay = (props) => {
        return (<Day 
        {...props} textStyle={{ color: '#fff', fontSize: 14 }}
        />)
    }

    return (
        <>
        <View style={[{ backgroundColor: color }, styles.container]}>
            <GiftedChat
                style={styles.text}
                renderBubble={renderBubble.bind()}
                renderSystemMessage={renderSystemMessage.bind()}
                renderDay={renderDay.bind()}
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                _id: 1,
                }}
                />
                { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
                }
        </View>
        </>

            
)   
    
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1
        },
        text:{
            color: '#fff'
        }
    }
)