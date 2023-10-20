import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import {Button} from 'react-native-paper'

const DetailScreen = ({ route, navigation }) => {
  const { username, subjectID } = route.params;
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://stud-atten.onrender.com/getSubjectAttendance/${username}/${subjectID}`);
        setAttendance(response.data);
      } catch (error) {
        Alert.alert('Error', 'There was an error fetching the attendance details.');
      }
    };

    fetchData();
  }, []);

  const renderAttendanceItem = ({ item , navigation}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.cell}>{item.status}</Text>
    </View>


  );

  return (
    <>
    <View style={styles.container}>
      <FlatList 
        data={attendance}
        renderItem={renderAttendanceItem}
        keyExtractor={(item, index) => index.toString()}
      />
      
      <Button 
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        Back to Attendance Report
      </Button>
    </View>
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7FAFD',  // Soft blue background color
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',  // Lighter border color
    paddingVertical: 15,  // Increased padding
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',  // White background for each row
    borderRadius: 10,
    marginVertical: 5,   // Space between rows
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  
    fontSize: 16, // Slightly bigger font
  },
  backButton: {
    paddingHorizontal: 20,  // Increased horizontal padding
    paddingVertical: 10,   // Increased vertical padding
    borderRadius: 20,      // Rounded edges
    alignItems: 'center',  // Center text/button label
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
export default DetailScreen;
