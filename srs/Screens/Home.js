import React, { useState, useEffect ,useRef } from 'react';
import { StyleSheet, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import { Card, Button, Title,Text, Paragraph } from 'react-native-paper';
import { getUsername } from '../Components/utility';
import io from 'socket.io-client';

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

const socket = io('http://10.0.2.2:3005');

export default function Home() {
    const usen = Uname();
    const [isCardVisible, setCardVisibility] = useState(false);
    const [sessionData, setSessionData] = useState({});
    const isAttendedRef = useRef(false);

    useEffect(() => {
        socket.emit('joinRollNumberRoom', usen);

        socket.on('receiveMessage', (data) => {
            setSessionData(data);
            console.log(data.visible);
            if(data.visible)
            {
                isAttendedRef.current = false;
            }

            if (!isAttendedRef.current && !data.visible) { // Check attendance status when session ends
                handleAttendance(usen, data.selectedSubject, 'Absent');
            }

            setCardVisibility(data.visible);
        });
        
        // Cleanup the listener when the component unmounts
        return () => {
            socket.off('receiveMessage');
        };
       
    }, [usen]);

    const handleAttendance = async (username, subjectID, status) => {
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

    const toggleCardVisibility = () => {
        setCardVisibility(!isCardVisible);
    };

    const handleButtonClick = () => {
        handleAttendance(usen, sessionData.selectedSubject, 'Present');
        isAttendedRef.current = true; // Set attendance status to true after student submits
        toggleCardVisibility();
    };

    return (
        <SafeAreaView style={Styles.safeArea}>
            {!isCardVisible && (<Text style={Styles.txt}>No Attendance Session </Text>)}
            {isCardVisible && (
                <Card style={Styles.container}>
                    <Card.Content>
                        <Title style={{fontWeight: 'bold'}}>{sessionData.selectedSubject}</Title>
                    </Card.Content>
                    <Card.Content>
                        <Paragraph>Faculty: {sessionData.teacherUsername}</Paragraph>
                        <Paragraph>Class: {sessionData.selectedClassroom}</Paragraph>
                        <Paragraph>Batch: {sessionData.batch}</Paragraph>
                    </Card.Content>
                    <Card.Actions>
                        <Button mode="contained" onPress={handleButtonClick}>
                            Submit Attendance
                        </Button>
                    </Card.Actions>
                </Card>
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
    txt: {
        alignContent: 'center',
        marginTop: 20,
        margin: 15,
        fontSize: 20,
    }
});
