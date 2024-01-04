import { View, Text, TextInput, TouchableHighlight, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Color, StandardBackground } from '../../constants/colors'
import { UtilityStyles } from '../../styles/utility'
import { FontStyles } from '../../styles/text'
import Logo from '../reusable/Logo'
import { TEMP_APP_KEY, BACKEND_URL } from '@env'
import useAppKey from '../../stores/CredentialStore'
import axios from 'axios'
import useWebSocketStore from '../../stores/Websocket'



type loginCredentials = {
  email: String,
  password: String
}


const Login = ({ navigation }) => { 

  const [loginCredentials, setLoginCredentials] = useState<loginCredentials | null>(null);
  const { socket, subscribeToSocket, resetSocket } = useWebSocketStore((state) => state)
  
  const [loggingIn, setLoggingIn] = useState(false);

  socket.onclose = () => {
    navigation.navigate("connection_lost")
  }  
  if (socket.readyState == 3) {
    navigation.navigate("connection_lost")
  }
  const { app_key, setCredentialStore } = useAppKey((state) => state);
  
  const handle_message = (event: any) => {
    if (event.data == "Login Successful") {
      navigation.navigate('home');
    }
  }
  useEffect(() => {
    subscribeToSocket(handle_message);
  }, [])
    
  const handle_login_submit = async () => {
    if (socket.readyState == 3) {
      navigation.navigate("connection_lost");
      return;
    }
    setLoggingIn(true);
    if (app_key != "") {
      await socket.send(JSON.stringify(
        {
          "email": loginCredentials?.email,
          "password": loginCredentials?.password,
          "app_key": app_key
        }
      ));
    } else {
      await axios.post("https://JakubSzamuk.co.uk/chat-app/configure-client", {
        "auth_object": {
          "email": loginCredentials?.email,
          "password": loginCredentials?.password,
        },
        "app_key": TEMP_APP_KEY
      }).then((data) => {
          socket.send(JSON.stringify(
            {
              "email": loginCredentials?.email,
              "password": loginCredentials?.password,
              "app_key": data.data.app_key
            }
          ));
          setCredentialStore(data.data);
        })
    }
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
                  {
                  loggingIn ? (
                    <ActivityIndicator />
                  ) :
                  (<Text style={FontStyles.StandardText}>
                    Login
                  </Text>)
                  }
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