import React, { useState, useEffect } from 'react';
import { View, Text,SafeAreaView, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import {Button} from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';


export const getUsername = async () => {
  try {
    return await SecureStore.getItemAsync('usernaame');
  } catch (e) {
    console.error('Failed to fetch the username.', e);
  }
};

function Uname() {
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

  return name;
}

const AttendanceReport = ({ navigation }) => {
  const [data, setData] = useState(null);
  const username = '22BCE100';  // Assuming you know the username

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:3010/getAttendance/${username}`);
        setData(response.data);
      } catch (error) {
        Alert.alert('Error', 'There was an error fetching the data.');
      }
    };

    fetchData();  // Fetch data immediately on component mount

    const intervalId = setInterval(fetchData, 3000);  // Fetch data every 30 seconds

    return () => clearInterval(intervalId);  // Clear the interval when the component is unmounted
  }, []);

  if (!data) {
    return <Text>Loading...</Text>;
  }


  return (
    <SafeAreaView style={styles.container}>
        {/* Render the table data */}
        {data.subjects.map((subject, index) => (
            <View key={index} style={styles.row}>
                <Text style={styles.cell}>{subject.subjectID}</Text>
                <Text style={styles.cell}>{subject.attendance.filter(a => a.status === 'present').length}</Text>
                <Button 
                    mode="contained"
                    onPress={() => navigation.navigate('Details', { attendance: subject.attendance, username: username, subjectID: subject.subjectID })}
                    style={styles.btn}
                >
                    Details
                </Button>
            </View>
        ))}
    </SafeAreaView>
);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F4F6FA',  // soft gray background
},
row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',  // white background for each row
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
},
cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
},
btn: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 20,
    marginHorizontal: 10,
}
});

export default AttendanceReport;