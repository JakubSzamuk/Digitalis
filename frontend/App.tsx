import 'react-native-gesture-handler';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import Home from './src/screens/Home/Home';
import AddChat from './src/screens/Home/add-screen/AddChat';
import AddedContact from './src/screens/Home/added_contact/AddedContact';
import Chat from './src/screens/Home/chat/Chat';
import ScanQr from './src/screens/Home/scan-screen/ScanQr';
import ShowQr from './src/screens/Home/show-qr/ShowQr';
import Login from './src/screens/Login/Login';
import Connection from './src/screens/reusable/Connection';
import LockedOut from './src/screens/reusable/LockedOut';
import OutOfChats from './src/screens/reusable/OutOfChats';
import useWebSocketStore from './src/stores/Websocket';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

function App(): React.JSX.Element {
  const [fontsLoaded] = useFonts({
    'Nunito-ExtraLight.ttf': require('./assets/fonts/Nunito-ExtraLight.ttf'),
    'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
    'Nunito-Medium': require('./assets/fonts/Nunito-Medium.ttf'),
    'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const { socket } = useWebSocketStore((state) => state);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{
          contentStyle: {
            backgroundColor: '#24282e',
          },
        }}>
        <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />

        <Stack.Screen name="home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="chat" component={Chat} options={{ headerShown: false }} />
        <Stack.Screen name="add_chat" component={AddChat} options={{ headerShown: false }} />
        <Stack.Screen name="show_qr" component={ShowQr} options={{ headerShown: false }} />
        <Stack.Screen name="scan_qr" component={ScanQr} options={{ headerShown: false }} />
        <Stack.Screen
          name="added_contact"
          component={AddedContact}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="out_of_chats" component={OutOfChats} options={{ headerShown: false }} />
        <Stack.Screen
          name="connection_lost"
          component={Connection}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="locked_out" component={LockedOut} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
