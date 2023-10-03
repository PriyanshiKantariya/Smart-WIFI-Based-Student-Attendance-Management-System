import { createStackNavigator } from '@react-navigation/stack';
import AttenRes from './AttenRes';
import AttenDet from './AttenDet';
import React from 'react';

const Stack = createStackNavigator();


export default function AttendanceReport({ navigation }) {

  return (
      <Stack.Navigator>
          <Stack.Screen name={'Attendance Report'} component={AttenDet} options={{ headerShown: false }} />
          <Stack.Screen name={'Details'} component={AttenRes} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
}

