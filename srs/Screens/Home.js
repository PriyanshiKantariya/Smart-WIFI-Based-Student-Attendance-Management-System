import React, { useState } from 'react';
import { StyleSheet, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import { Card, Button, Title,Text, Paragraph } from 'react-native-paper';

const handleAttendance = async (username, subjectID, status = 'present') => {
    try {
        const response = await axios.post('http://10.0.2.2:3010/recordAttendance', {
            username,
            subjectID,
            status
        });

        if (response.data.success) {
            Alert.alert('Success', 'Attendance recorded successfully!');
        } else {
            Alert.alert('Error', response.data.message || 'Failed to record attendance.');
        }
    } catch (error) {
        Alert.alert('Error', 'There was an error connecting to the server.');
    }
};

export default function Home() {
    const [isCardVisible, setCardVisibility] = useState(true);

    const toggleCardVisibility = () => {
        setCardVisibility(!isCardVisible);
    };

    const handleButtonClick = () => {
        handleAttendance("22BCE100", "Physics101");
        toggleCardVisibility();
    };

    return (
        <SafeAreaView style={Styles.safeArea}>
          {!isCardVisible && (<Text style={Styles.txt}>No Attendance Session </Text>)}
            {isCardVisible && (
                <Card style={Styles.container}>
                    <Card.Content>
                        <Title>Data Structure and Algorithms</Title>
                    </Card.Content>

                    <Card.Content>
                        <Paragraph>Faculty: Dr. Vijay Ukani</Paragraph>
                        <Paragraph>Class: N301</Paragraph>
                        <Paragraph>Batch: B</Paragraph>
                    </Card.Content>

                    <Card.Actions>
                        <Button mode="contained" onPress={handleButtonClick}>
                            Submit Attendance
                        </Button>
                    </Card.Actions>
                </Card>
            )}

            {!isCardVisible && (
                <Button mode="contained" onPress={toggleCardVisibility}>
                    Show Card
                </Button>
            )}
        </SafeAreaView>
    );
}

const Styles = StyleSheet.create({
    safeArea: {
        flex: 1,

    },
    container: {
        alignContent: 'center',
        marginTop: 20,
        margin: 15,
    },
    txt:{
      alignContent: 'center',
      marginTop: 20,
      margin: 15,
      fontSize: 20,
    }
});
