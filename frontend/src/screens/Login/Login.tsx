import { View, Text, TextInput, TouchableHighlight, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Color, StandardBackground } from '../../constants/colors'
import { UtilityStyles } from '../../styles/utility'
import { FontStyles } from '../../styles/text'
import Logo from '../reusable/Logo'
import { APP_KEY } from '@env'
import useWebSocketStore from '../../stores/Websocket'



type loginCredentials = {
  email: String,
  password: String
}


const Login = ({ navigation }) => { 

  const [loginCredentials, setLoginCredentials] = useState<loginCredentials | null>(null);

  const { socket, subscribeToSocket, resetSocket } = useWebSocketStore((state) => state);

  useEffect(() => {
    const handle_message = (event: any) => {
      if (event.data == "Login Successful") {
        navigation.navigate('home');
      } else {
        resetSocket();
      }
    }
    subscribeToSocket(handle_message);
  }, [])

  const handle_login_submit = () => {
    socket.send(JSON.stringify(
      {
        "email": "test",
        "password": "password",
        "app_key": "Hello"
      }
    ));
  }


  return (
    <SafeAreaView>
      <StandardBackground style={UtilityStyles.mainBackground}>
        <View style={{ paddingTop: 132, flex: 1  }}>
          <Text style={[FontStyles.Header, { marginLeft: 42, marginBottom: 50 }]}>Sign in</Text>

          <TextInput placeholder='Username' onChangeText={(text: String) => setLoginCredentials({password: "", ...loginCredentials, email: text})} placeholderTextColor={Color.text} style={[FontStyles.StandardText, { marginLeft: 42, marginBottom: -6 }]} />
          <View style={{ alignItems: "center", width: "100%" }}>
            <StandardBackground withBorder style={{ width: "80%", height: 5 }}></StandardBackground>
          </View>

          <TextInput placeholder='Password' onChangeText={(text: String) => setLoginCredentials({email: "", ...loginCredentials, password: text})} placeholderTextColor={Color.text} style={[FontStyles.StandardText, { marginLeft: 42, marginBottom: -6, marginTop: 30 }]} />
          <View style={{ alignItems: "center", width: "100%" }}>
            <StandardBackground withBorder style={{ width: "80%", height: 5, borderRadius: 3 }}></StandardBackground>
            <TouchableOpacity style={{ marginTop: 50 }} onPress={handle_login_submit}>
              <StandardBackground withBorder style={{ borderRadius: 3 }}>
                <View style={{ width: 212, height: 52, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={FontStyles.StandardText}>
                    Login
                  </Text>
                </View>
              </StandardBackground>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center', width: "100%", marginBottom: 20 }}>
          <Logo />
        </View>
      </StandardBackground>
    </SafeAreaView>
  )
}

export default Login