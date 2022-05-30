import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from "react/cjs/react.development";

export default function Chat(props) {

    let { name, color } = props.route.params;
    useEffect(() =>     props.navigation.setOptions ({ title: name}))


    return (
        <View style={[{ backgroundColor: color }, styles.container]}>
            <Text style={styles.text}>Welcome to your Chat screen!</Text>
        </View>
    )
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },

        text: { 
            color: '#fff',
            fontSize: 16
        }
    }
)