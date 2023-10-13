// App.js
import React, { useContext } from 'react';
import { AuthContext,AuthProvider } from './srs/Components/authContext';
import LoginPage from './srs/Screens/Login';
import MainDrawer from './srs/Components/MainDrawer';
import { NavigationContainer } from '@react-navigation/native';

const Content = () => {
    const { isAuthenticated} = useContext(AuthContext);


    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return (
      <NavigationContainer>
    <MainDrawer/>
    </NavigationContainer>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Content />
        </AuthProvider>
    );
};

export default App;
