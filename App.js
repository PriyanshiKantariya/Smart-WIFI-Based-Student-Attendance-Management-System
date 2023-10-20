import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext, AuthProvider } from './srs/Components/authContext';
import LoginPage from './srs/Screens/Login';
import MainDrawer from './srs/Components/MainDrawer';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

const Content = () => {
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return (
        <NavigationContainer>
            <MainDrawer />
        </NavigationContainer>
    );
};

const App = () => {
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        // Listener for incoming notifications while the app is in the foreground
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        // Listener for when user interacts with the notification (e.g., taps on it)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            // Add logic for navigation or other interactions here
        });

        // Cleanup listeners on unmount
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <AuthProvider>
            <Content />
        </AuthProvider>
    );
};

export default App;
