import React, { useState, useEffect ,useRef } from 'react';
import { StyleSheet, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import { Card, Button, Title,Text, Paragraph } from 'react-native-paper';
import { getUsername } from '../Components/utility';
import io from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';
import * as Location from 'expo-location';

const fetchExpoToken = async () => {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
    }

    token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
    })).data;

    return token;
};

async function requestWifiPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access WiFi information was denied because it requires location access.');
    return false;
  }
  return true;
}

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
        if(requestWifiPermission())
        {
         NetInfo.fetch().then((netInfo) => {
            setroutermac(netInfo.details.bssid);
            console.log(netInfo.details.bssid);
          });
        }else{Alert.alert("Permission Not Granted")}

        const fetchAndStoreExpoToken = async () => {
            const expoToken = await fetchExpoToken();
            if (expoToken) {
                const tokenResponse = await fetch('https://teach-node.onrender.com/update-expo-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        rollno: usen,
                        expoToken: expoToken
                    })
                });
                const tokenData = await tokenResponse.json();
                if (tokenData.success) {
                    console.log("Token updated successfully");
                } else {
                    console.log("Failed to update token:", tokenData.message);
                }
            }
        }

        fetchAndStoreExpoToken();
      
        socket.emit('joinRollNumberRoom', usen);

        socket.on('receiveMessage', (data) => {
            setSessionData(data);
            if(data.visible && !isAttendedRef.current)
            {
                setSessionData(data);
                setCardVisibility(data.visible);
            }

            if (!data.visible) { 
                isAttendedRef.current = false;
                setCardVisibility(data.visible);
            }
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
