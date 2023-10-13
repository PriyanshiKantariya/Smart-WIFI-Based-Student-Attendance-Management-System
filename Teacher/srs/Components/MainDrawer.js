import React, { useContext } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Home from '../Screens/Home'
import AttendanceReport from '../Screens/AttendanceReport'
import { Text } from 'react-native'
import { useState, useEffect } from 'react';
import { getname } from './utility'


const Drawer = createDrawerNavigator();

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
  
export default function MainDrawer() {


    return (
     
        
            <Drawer.Navigator>
                
                <Drawer.Screen  name="Home" component={Home} options={{
                    headerRight: () => (
                        <Text style={{ marginRight: 10,fontWeight: "bold" }}><Header/></Text>
                    ),
                }} />
                <Drawer.Screen name="Attendance Details" component={AttendanceReport} />
            </Drawer.Navigator>
    );
}