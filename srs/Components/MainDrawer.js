import React, { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or another icon library of your choice
import Home from '../Screens/Home';
import AttendanceReport from '../Screens/AttendanceReport';
import { getUsername } from './utility';

const Tab = createBottomTabNavigator();

function Header() {
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchUsername = async () => {
            const storedName = await getUsername();
            if (storedName) {
                setName(storedName);
            }
        };

        fetchUsername();
    }, []);

    return <Text>Welcome, {name}</Text>;
}

export default function MainDrawer() {
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

                  return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'purple',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: [
                  {
                      display: 'flex'
                  },
                  null
              ]
          })}
      >
          <Tab.Screen name="Home" component={Home} options={{
              headerRight: () => (
                  <Text style={{ marginRight: 10, fontWeight: "bold" }}><Header /></Text>
              ),
          }} />
          <Tab.Screen name="Attendance Details" component={AttendanceReport} />
      </Tab.Navigator>
  );
}
