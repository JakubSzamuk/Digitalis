import React, { useEffect, useState } from 'react';
import {
  NavigationContainer, useNavigation
} from '@react-navigation/native'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login/Login';
import Home from './screens/Home/Home';
import AddChat from './screens/Home/add-screen/AddChat';
import ShowQr from './screens/Home/show-qr/ShowQr';
import AddedContact from './screens/Home/added_contact/AddedContact';
import Chat from './screens/Home/chat/Chat';
import ScanQr from './screens/Home/scan-screen/ScanQr';
import useWebSocketStore from './stores/Websocket';
import Connection from './screens/reusable/Connection';
import OutOfChats from './screens/reusable/OutOfChats';
import Info from './screens/info/Info';
import LockedOut from './screens/reusable/LockedOut';

const Stack = createNativeStackNavigator();


function App(): React.JSX.Element {
  const { socket } = useWebSocketStore((state) => state);


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'login'}>
        <Stack.Screen name='login' component={Login} options={{ headerShown: false }} />
        
        <Stack.Screen name='home' component={Home} options={{ headerShown: false }} />
        <Stack.Screen name='chat' component={Chat} options={{ headerShown: false }} />
        <Stack.Screen name='add_chat' component={AddChat} options={{ headerShown: false }} />
        <Stack.Screen name='show_qr' component={ShowQr} options={{ headerShown: false }} />
        <Stack.Screen name='scan_qr' component={ScanQr} options={{ headerShown: false }} />
        <Stack.Screen name='added_contact' component={AddedContact} options={{ headerShown: false }} />
        
        <Stack.Screen name='out_of_chats' component={OutOfChats} options={{ headerShown: false }} />
        <Stack.Screen name='connection_lost' component={Connection} options={{ headerShown: false }} />
        <Stack.Screen name='locked_out' component={LockedOut} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 

export default App;

