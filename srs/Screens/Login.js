// LoginPage.js
import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text,TextInput, Alert } from 'react-native';
import { AuthContext } from '../Components/authContext';
import * as SecureStore from 'expo-secure-store';
import { Button } from 'react-native-paper';


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setIsAuthenticated} = useContext(AuthContext);



    const handleLogin = () => {
        fetch('http://10.0.2.2:5000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Save token to SecureStore
                SecureStore.setItemAsync('userToken', data.token);
                SecureStore.setItemAsync('usernaame', username);
                setIsAuthenticated(true);
    
            } else {
                // Handle error
                Alert.alert(data.error);
            }
        });
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
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
            <Button title="Login" mode='contained' onPress={handleLogin} >
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