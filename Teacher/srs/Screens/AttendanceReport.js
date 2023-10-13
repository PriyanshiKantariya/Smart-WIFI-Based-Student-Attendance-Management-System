import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

function App() {
  const [open1, setOpen1] = useState(false);
  const [value1, setValue1] = useState(null);
  const [items1, setItems1] = useState([
    { label: 'Java', value: 'java' },
    { label: 'JavaScript', value: 'js' },
    { label: 'Python', value: 'python' },
  ]);

  const [open2, setOpen2] = useState(false);
  const [value2, setValue2] = useState(null);
  const [items2, setItems2] = useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ]);

  const handleButtonPress = () => {
    console.log('Dropdown1 value:', value1);
    console.log('Dropdown2 value:', value2);
  };

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open1}
        value={value1}
        items={items1}
        setOpen={setOpen1}
        setValue={setValue1}
        setItems={setItems1}
        searchable={true}
        placeholder="Select a programming language"
        searchPlaceholder="Search for a language"
        searchClearIcon={{ name: "close", size: 18 }}
        containerStyle={styles.dropdown}
      />

      <DropDownPicker
        open={open2}
        value={value2}
        items={items2}
        setOpen={setOpen2}
        setValue={setValue2}
        setItems={setItems2}
        searchable={true}
        placeholder="Select a fruit"
        searchPlaceholder="Search for a fruit"
        searchClearIcon={{ name: "close", size: 18 }}
        containerStyle={styles.dropdown}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dropdown: {
    marginBottom: 20,
  },
});

export default App;
