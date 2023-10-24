import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { getUsername } from '../Components/utility';
import io from 'socket.io-client';
import { getname } from '../Components/utility';

const socket = io('https://socket-api-a3lh.onrender.com');

function useUname() {
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

function usename() {
  const [namee, setNamee] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const storedName = await getname();
      if (storedName) {
        setNamee(storedName);
      }
    };

    fetchUsername();
  }, []);

  return namee;
}

function App() {
  const userName = useUname();
  const name = usename();
  const [attendanceStarted, setAttendanceStarted] = useState(false);
  const attendanceIntervalRef = useRef(null);

  const [openclass, setOpenclass] = useState(false);
  const [valueclass, setValueclass] = useState(null);
  const [itemsclass, setItemsclass] = useState([]);

  const [opensubject, setOpensubject] = useState(false);
  const [valuesubject, setValuesubject] = useState(null);
  const [itemssubject, setItemssubject] = useState([]);

  const [openroom, setOpenroom] = useState(false);
  const [valueroom, setValueroom] = useState(null);
  const [itemsroom, setItemsroom] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('joinRollNumberRoom', userName);
    });

    fetchClassValues();
    fetchSubjectValues();
    fetchRoomValues();

    return () => {
      socket.off('connect');
    };
  }, []);

  const handleAttendanceStart = async () => {
    const data = {
        teacherUsername: name,
        selectedSubject: valuesubject,
        batch: valueclass,
        visible: true,
        mac: valueroom,
    };

    if (!data.teacherUsername || !data.selectedSubject || !data.mac || !data.batch) {
        Alert.alert('Choose all Options from Dropdown');
    } else {
        socket.emit('sendMessageToClass', { batch: valueclass, data });
        setAttendanceStarted(true);

        try {
            await axios.post('https://teach-node.onrender.com/send-notification', {
                batch: valueclass,
                title: "New Attendance Session",
                message: `Attendance started by ${name} for subject ${data.selectedSubject}. Please mark your attendance.`
            });
        } catch (error) {
            console.error("Error sending notification:", error);
        }

        // Start interval
        attendanceIntervalRef.current = setInterval(() => {
            socket.emit('sendMessageToClass', { batch: valueclass, data });
            console.log('sent');
        }, 3000);
    }
  };

  const handleAttendanceStop = () => {
    setAttendanceStarted(false);
    
    const data = {
      teacherUsername: name,
      selectedSubject: valuesubject,
      batch: valueclass,
      visible : false,
      mac : valueroom,
    };

    socket.emit('sendMessageToClass', { batch: valueclass, data });
    setValueclass(null);
    setValuesubject(null);
    setValueroom(null);

    // Clear the interval
        clearInterval(attendanceIntervalRef.current);
        attendanceIntervalRef.current = null;
        console.log('stop');
    
    markAbsentees();
  };

  const markAbsentees = async () => {
    try {
      const response = await axios.post('https://teach-node.onrender.com/mark-absentees', {
        subjectID: valuesubject,  // Assuming this is the ID of the subject
        batch: valueclass,
        date: new Date().toISOString().slice(0, 10)  // Today's date in YYYY-MM-DD format
      });
      console.log("called");
      console.log(new Date().toISOString().slice(0, 10));
  
      if (!response.data.success) {
        console.error('Error marking absentees:', response.data.message);
      }
    } catch (error) {
      console.error('Error marking absentees:', error);
    }
  }

  const fetchSubjectValues = async () => {
    try {
      const response = await axios.get('https://teach-node.onrender.com/get-subject-values');
      if (response.data.success) {
        setItemssubject(response.data.data);
      } else {
        console.error('Failed to fetch values:', response.data.error);
      }
    } catch (error) {
      console.error('Error fetching values:', error);
    }
  };

  const fetchClassValues = async () => {
    try {
      const response = await axios.get('https://teach-node.onrender.com/get-class-values');
      if (response.data.success) {
        setItemsclass(response.data.data);
      } else {
        console.error('Failed to fetch values:', response.data.error);
      }
    } catch (error) {
      console.error('Error fetching values:', error);
    }
  };

  const fetchRoomValues = async () => {
    try {
      const response = await axios.get('https://teach-node.onrender.com/get-room-values');
      if (response.data.success) {
        setItemsroom(response.data.data);
      } else {
        console.error('Failed to fetch values:', response.data.error);
      }
    } catch (error) {
      console.error('Error fetching values:', error);
    }
  };

  return (

    <>
    {!attendanceStarted ? (
      <View style={styles.container}>
        <Text style={styles.text}>Batch : </Text>
      <DropDownPicker style={styles.picker}
        dropDownContainerStyle={styles.dropDown}
        searchContainerStyle={styles.searchInput}
        zIndex={3}  // Adjust zIndex based on whether the dropdown is open
        zIndexInverse={1}
        open={openclass}
        value={valueclass}
        items={itemsclass.map(i => ({ label: i.value, value: i.value }))}
        setOpen={setOpenclass}
        setValue={setValueclass}
        searchable={true}
        placeholder="Select an item"
        searchPlaceholder="Search for an item"
        searchClearIcon={{ name: "close", size: 18 }}
  
      />
      <Text style={styles.text}>Subject : </Text>
      <DropDownPicker
        style={styles.picker}
        dropDownContainerStyle={styles.dropDown}
        searchContainerStyle={styles.searchInput}
        zIndex={2}  // Adjust zIndex based on whether the dropdown is open
        zIndexInverse={2}
        open={opensubject}
        value={valuesubject}
        items={itemssubject.map(i => ({ label: i.value, value: i.value }))}
        setOpen={setOpensubject}
        setValue={setValuesubject}
        searchable={true}
        placeholder="Select an item"
        searchPlaceholder="Search for an item"
        searchClearIcon={{ name: "close", size: 18 }}
      />
      <Text style={styles.text}>ClassRoom : </Text>
      
      <DropDownPicker
        style={styles.picker}
        dropDownContainerStyle={styles.dropDown}
        searchContainerStyle={styles.searchInput}
        zIndex={1}  // Adjust zIndex based on whether the dropdown is open
        zIndexInverse={3}
        open={openroom}
        value={valueroom}
        items={itemsroom.map(i => ({ label: i.label, value: i.value }))}
        setOpen={setOpenroom}
        setValue={setValueroom}
        searchable={true}
        placeholder="Select an item"
        searchPlaceholder="Search for an item"
        searchClearIcon={{ name: "close", size: 18 }}
      />
        <Button style={styles.btn} mode='contained' onPress={handleAttendanceStart}>
          Start Attendance
        </Button>
      </View>
    ) : (
      <View style={styles.btn}>
        <Button mode='contained' onPress={handleAttendanceStop}>
          Stop Attendance
        </Button>
      </View>
    )}
  </>

 
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  picker: {
    borderRadius: 20,
  },
  dropDown:
  {

    borderRadius: 20,
  },
  searchInput: {
    margin: 10,
    borderColor: 'white',
  },
  text:{
    marginTop:15,
    marginLeft:10,
    marginBottom: 3,
    fontSize:15,
    fontWeight: 'bold',
  },
  btn:{
    marginTop:25,
    alignItems: 'center',
    marginBottom: 5,

  }
});

export default App;


