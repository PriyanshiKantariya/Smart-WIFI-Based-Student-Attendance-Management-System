import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { getUsername } from '../Components/utility';
import io from 'socket.io-client';
import { getname } from '../Components/utility';

const socket = io('https://socket-api-a3lh.onrender.com');

function useUname() { // Rename to signify it's a hook
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
function usename() { // Rename to signify it's a hook
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
  const userName = useUname(); // Use the custom hook
  const name = usename();
  const [attendanceStarted, setAttendanceStarted] = useState(false);

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

    // Your fetching functions go here.
    fetchClassValues();
    fetchSubjectValues();
    fetchRoomValues();

    // Cleanup
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


    if(!data.teacherUsername || !data.selectedSubject || !data.mac || !data.batch) {
        Alert.alert('Choose all Options from Dropdown');
    } else {
        socket.emit('sendMessageToClass', { batch: valueclass, data });
        setAttendanceStarted(true);

        // Send push notification
        try {
            await axios.post('https://teach-node.onrender.com/send-notification', {
                batch: valueclass, // Pass the batch value here
                title: "New Attendance Session",
                message: `Attendance started by ${name} for subject ${data.selectedSubject}. Please mark your attendance.`
            });
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
};



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

  const handleAttendanceStop = () => {
    setAttendanceStarted(false); // Set attendance mode to stopped

    const data = {
      teacherUsername: name, // Use userName from hook
      selectedSubject: valuesubject,
      batch: valueclass,
      visible : false,
      mac : valueroom,
    };
    
    socket.emit('sendMessageToClass', { batch: valueclass, data });
        // Reset values of dropdowns
        setValueclass(null);
        setValuesubject(null);
        setValueroom(null);

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


