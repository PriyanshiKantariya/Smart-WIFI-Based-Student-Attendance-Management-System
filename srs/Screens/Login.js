import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Alert } from 'react-native';
import { AuthContext } from '../Components/authContext';
import * as SecureStore from 'expo-secure-store';
import { Button } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setIsAuthenticated } = useContext(AuthContext);

    const fetchExpoToken = async () => {
        let token;
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }

        token = (await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        })).data;

        return token;
    };

    const handleLogin = async () => {
        fetch('https://stud-atten.onrender.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        })
            .then(response => response.json())
            .then(async data => {
                if (data.success) {
                    SecureStore.setItemAsync('userToken', data.token);
                    SecureStore.setItemAsync('usernaame', username);
                    setIsAuthenticated(true);

                    // Get Expo Token
                    const expoToken = await fetchExpoToken();
                    if (expoToken) {
                        fetch('https://teach-node.onrender.com/update-expo-token', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                rollno: username, // assuming the username is the roll number
                                expoToken: expoToken
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                console.log("Token updated successfully");
                            } else {
                                console.log("Failed to update token:", data.message);
                            }
                        })
                        .catch(error => {
                            console.log("Error updating token:", error);
                        });
                    }
                } else {
                    Alert.alert(data.error);
                }
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login - Student</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" mode='contained' onPress={handleLogin}>
                Login
            </Button>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F7F7F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    input: {
        width: '80%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
    },
    passwordInput: {
        marginBottom: 20,
    }
});

export default LoginPage;