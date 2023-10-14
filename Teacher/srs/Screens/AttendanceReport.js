import React, { useState, useEffect } from 'react';
import { View, ScrollView, FlatList, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';
import { Button } from 'react-native-paper';

export default function AttendanceApp() {

  useFocusEffect(
    React.useCallback(() => {
      setValueclass(null);
      setValuesubject(null);
      setValueMonth(null);
      setAttendanceData([]);
      return () => {
        // Clean-up actions if needed when screen loses focus
      };
    }, [])
  );

  const [openclass, setOpenclass] = useState(false);
  const [valueclass, setValueclass] = useState(null);
  const [itemsclass, setItemsclass] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  const [opensubject, setOpensubject] = useState(false);
  const [valuesubject, setValuesubject] = useState(null);
  const [itemssubject, setItemssubject] = useState([]);

  const [openMonth, setOpenMonth] = useState(false);
  const [valueMonth, setValueMonth] = useState(null);



  useEffect(() => {
    // Subjects fetch
    const fetchSubjectValues = async () => {
      try {
        const response = await axios.get('http://10.10.12.25:5002/get-subject-values');
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
        const response = await axios.get('http://10.10.12.25:5002/get-class-values');
        if (response.data.success) {
          setItemsclass(response.data.data);
        } else {
          console.error('Failed to fetch values:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching values:', error);
      }
    };

    fetchClassValues();
    fetchSubjectValues();
  }, []);


  const generateTableHeaders = () => {
    let headers = ["Roll No."];
    for (let i = 1; i <= 31; i++) {
      headers.push(i.toString());
    }
    return headers;
  };

  const fetchAttendance = () => {
    axios.get(`http://10.10.12.25:5002/attendance`, {
      params: {
        subjectId: valuesubject,
        batchValue: valueclass,
        month: valueMonth
      }
    }).then(response => {
      const sortedData = response.data.sort((a, b) => a.username.localeCompare(b.username)); // Sorting by roll no.
      setAttendanceData(sortedData);
    }).catch(error => {
      console.error("Error fetching attendance:", error);
    });
  };



  const exportToExcel = async () => {
    const headers = generateTableHeaders();
    const wsData = [];

    // Add Subject name, Class name, and Month at the top
    wsData.push([`Subject: ${valuesubject}`]); // Assuming valuesubject holds the subject name
    wsData.push([`Class: ${valueclass}`]); // Assuming valueclass holds the class name
    wsData.push([`Month: ${months[valueMonth - 1].label}`]); // Assuming valueMonth is the selected month number

    // Now add a blank line and then the actual headers
    wsData.push([]);
    wsData.push(headers);

    attendanceData.forEach(item => {
      const row = [];
      row.push(item.username);
      headers.slice(1).forEach(day => {
        const attForDay = item.attendance.find(att => new Date(att.date).getDate().toString() === day);
        row.push(attForDay ? attForDay.status : '-');
      });
      wsData.push(row);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "AttendanceSheet");

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    const uri = FileSystem.documentDirectory + 'attendanceReport.xlsx';
    await FileSystem.writeAsStringAsync(uri, wbout, { encoding: 'base64' });
    Sharing.shareAsync(uri);
  };


  const months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];


  return (
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
      <Text style={styles.text}>Month : </Text>
      <DropDownPicker
        style={styles.picker}
        dropDownContainerStyle={styles.dropDown}
        searchContainerStyle={styles.searchInput}
        zIndex={1}  // Adjust zIndex based on whether the dropdown is open
        zIndexInverse={3}
        open={openMonth}  // NOTE: you might want to rename this state variable for clarity
        value={valueMonth}  // NOTE: you might want to rename this state variable for clarity
        items={months}
        setOpen={setOpenMonth}  // NOTE: you might want to rename this setter for clarity
        setValue={setValueMonth}  // NOTE: you might want to rename this setter for clarity
        searchable={true}
        placeholder="Select a month"
        searchPlaceholder="Search for a month"
        searchClearIcon={{ name: "close", size: 18 }}
      />

      <Button style={styles.btn} mode='contained' title="Fetch Attendance" onPress={fetchAttendance} >Generate Report</Button>
      <Button style={{
        marginTop: 10,
        alignItems: 'center',
        marginBottom: 5,
      }} mode='contained' title="Export to Excel" onPress={() => exportToExcel(attendanceData, generateTableHeaders)} >Download Report</Button>



      <ScrollView horizontal={true}>
        <View>
          <View style={styles.row}>
            {generateTableHeaders().map((header, index) => (
              <View key={index} style={styles.cell}><Text>{header}</Text></View>
            ))}
          </View>
          <FlatList
            data={attendanceData}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View style={styles.cell}><Text>{item.username}</Text></View>
                {generateTableHeaders().slice(1).map((day, index) => {
                  const attForDay = item.attendance.find(att => new Date(att.date).getDate().toString() === day);
                  return <View key={index} style={styles.cell}><Text>{attForDay ? attForDay.status : '-'}</Text></View>;
                })}
              </View>
            )}
            keyExtractor={item => item.username}
          />
        </View>
      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  text: {
    marginTop: 15,
    marginLeft: 10,
    marginBottom: 3,
    fontSize: 15,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: 'gray',
    padding: 5,
    width: 100, // adjust width as per your requirement
    alignItems: 'center'
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
  text: {
    marginTop: 15,
    marginLeft: 10,
    marginBottom: 3,
    fontSize: 15,
    fontWeight: 'bold',
  },
  btn: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 5,

  }
});
