import React, { useState, useEffect ,useRef } from 'react';
import { StyleSheet, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import { Card, Button, Title,Text, Paragraph } from 'react-native-paper';
import { getUsername } from '../Components/utility';
import io from 'socket.io-client';
import { NetworkInfo } from 'react-native-network-info';





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


const socket = io('https://socket-api-a3lh.onrender.com');

export default function Home() {
    const usen = Uname();
    const [isCardVisible, setCardVisibility] = useState(false);
    const [sessionData, setSessionData] = useState({});
    const isAttendedRef = useRef(false);
    const [routermac, setroutermac] = useState('');


    useEffect(() => {
      
        const getBSSID = async () => {
            const fetchedBSSID = await NetworkInfo.getBSSID();
            setroutermac(fetchedBSSID);
         };
      
         getBSSID();
        socket.emit('joinRollNumberRoom', usen);

        socket.on('receiveMessage', (data) => {
            setSessionData(data);
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
            const response = await axios.post('https://stud-atten.onrender.com/recordAttendance', {
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
        if(routermac === sessionData.mac)
        {
        handleAttendance(usen, sessionData.selectedSubject, 'Present');
        isAttendedRef.current = true; // Set attendance status to true after student submits
        toggleCardVisibility();
        }
        else{
            Alert.alert("Connect to Class Access Point");
        }
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
