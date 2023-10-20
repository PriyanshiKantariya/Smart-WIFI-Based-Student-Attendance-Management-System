import { View, Text,SafeAreaView, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import {Button} from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getUsername } from '../Components/utility';
import { useState,useEffect } from 'react';

function useUsername() {
  const [name, setName] = useState(null);

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
  const [data, setData] = useState();
 
  const username =  useUsername();  // Assuming you know the username
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://stud-atten.onrender.com/getAttendance/${username}`);
        setData(response.data);
      } catch (error) {
        // Alert.alert('Error', 'There was an error fetching the data.');
      }
    };
    if(isFocused)
    {
      fetchData();
    }
  }, [username, isFocused]);

  if (!data) {
    return <Text>Loading...</Text>;
  }


  return (
    <SafeAreaView style={styles.container}>
        {/* Render the table data */}
        {data.subjects.map((subject, index) => (
            <View key={index} style={styles.row}>
                <Text style={styles.cell}>{subject.subjectID}</Text>
                <Text style={styles.cell}>{subject.attendance.filter(a => a.status === 'Present').length}</Text>
                <Text style={styles.cell}>{subject.attendance.filter(a => a.status === 'Absent').length}</Text>
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
    fontSize: 14,
    paddingLeft: 5,
},
btn: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 20,
    marginHorizontal: 10,
}
});

export default AttendanceReport;