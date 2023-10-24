import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Home from '../Screens/Home';
import AttendanceReport from '../Screens/AttendanceReport';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { getname } from './utility';

const Tab = createBottomTabNavigator();

function Header() {
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchUsername = async () => {
            const storedName = await getname();
            if (storedName) {
                setName(storedName);
            }
        };

        fetchUsername();
    }, []);

    return <Text>Welcome, {name}</Text>;
}

function TabBarIcon(props) {
    return <Ionicons size={30} {...props} />;
}

export default function MainTabNavigator() {
  return (
      <Tab.Navigator
          screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Home') {
                      iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'Attendance Details') {
                      iconName = focused ? 'list-circle' : 'list-circle-outline';
                  }

                  return <TabBarIcon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "#6850a4",
              tabBarInactiveTintColor: "gray",
              tabBarStyle: [
                  { display: "flex",
                    borderTopWidth: 1.5,
                    borderColor: '#6850a4'
                       },
                  null
              ]
          })}
      >
          <Tab.Screen name="Home" component={Home} options={{
              headerRight: () => (
                  <Text style={{ marginRight: 10, fontWeight: "bold" }}>
                      <Header />
                  </Text>
              ),
          }} />
          <Tab.Screen name="Attendance Details" component={AttendanceReport} />
      </Tab.Navigator>
  );
}