import React, { useState } from 'react';
import { Text, TextInput, View, Pressable, StyleSheet, ImageBackground, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';

import BackgroundImage from '../img/BackgroundImage.png';

import { SvgUri } from 'react-native-svg';

const colors = {
    black: '#090C08',
    purple: '#474056',
    blue: '#8A95A5',
    green: '#B9C6AE'
}

export default function Start(props) {

    let [name, setName] = useState();
    let [color = '#8A95A5', setColor] = useState();

    return (

        <View style={styles.container}>
            {/* set backgroung image */}
            <ImageBackground
                source={BackgroundImage}
                resizeMode="cover"
                style={styles.image}>

                {/* set title box and title */}
                <View style={styles.titleBox}>
                    <Text style={styles.title}>ChatterBox</Text>
                </View>

                {/* set box with remaining content */}
                <View style={styles.contentBox}>
                    <View style={styles.inputBox}>
                        {/* <SvgUri
                            width="5%"
                            height="80%"
                            style={styles.svg}
                            uri="https://gist.githack.com/mareeanamaro/23c8f293334f973e59f6065b7db2a24f/raw/9b720e53a177af5976e4666ab872c4154d04e24f/icon.svg"
                        /> */}
                        <TextInput
                            style={styles.input}
                            placeholder="Your Name"
                            value={name}
                            onChangeText={(name) => setName(name)}
                        />
                         { Platform.OS === 'iOS' ? <KeyboardAvoidingView behavior="height" /> : null
                }
                    </View>
                    <View style={styles.backgroundChoiceBox}>
                        <Text style={styles.backgroundChoiceText}>Choose Background Color:</Text>
                        <View style={styles.colorArray}>

                            <TouchableOpacity
                                style={[{ backgroundColor: colors.black }, styles.colorButton]}
                                onPress={() => setColor(colors.black)}
                            >
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[{ backgroundColor: colors.purple }, styles.colorButton]}
                                onPress={() => setColor(colors.purple)}
                            >
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[{ backgroundColor: colors.blue }, styles.colorButton]}
                                onPress={() => setColor(colors.blue)}
                            >
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[{ backgroundColor: colors.green }, styles.colorButton]}
                                onPress={() => setColor(colors.green)}
                            >
                            </TouchableOpacity>

                        </View>
                    </View>
                    <Pressable
                        onPress={() => props.navigation.navigate('Chat', { name: name, color: color })}
                        style={({ pressed }) => [
                            {
                                backgroundColor: pressed
                                    ? '#585563'
                                    : '#757083'
                            },
                            styles.button
                        ]}
                    >
                        <Text style={styles.buttonText}>Start Chatting</Text>
                    </Pressable>
                </View>
            </ImageBackground>

        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    image: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

    titleBox: {
        width: '88%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        height: '56%'
    },

    title: {
        fontSize: 45,
        fontWeight: '600',
        color: '#ffffff'
    },

    contentBox: {
        backgroundColor: '#fff',
        height: '44%',
        width: '88%',
        margin: '12%',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },

    inputBox: {
        borderWidth: 2,
        borderColor: '#757083',
        width: '88%',
        height: '15%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    svg: {
        margin: 5
    },

    input: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 50,
        marginLeft: 5
    },

    backgroundChoiceText: {
        color: '#757083',
        fontSize: 16,
        fontWeight: '300'
    },

    colorArray: {
        flexDirection: 'row'
    },

    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 5
    },

    button: {
        width: '88%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff'
    },


})