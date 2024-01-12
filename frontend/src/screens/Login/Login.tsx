// import { TEMP_APP_KEY, BACKEND_URL } from '@env';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import { Color, StandardBackground } from '../../constants/colors';
import useAppKey from '../../stores/CredentialStore';
import useWebSocketStore from '../../stores/Websocket';
import { FontStyles } from '../../styles/text';
import { UtilityStyles } from '../../styles/utility';
import Logo from '../reusable/Logo';
const TEMP_APP_KEY = '123';

type loginCredentials = {
  email: string;
  password: string;
};

const Login = ({ navigation }: any) => {
  const [loginCredentials, setLoginCredentials] = useState<loginCredentials | null>(null);
  const { socket, subscribeToSocket, resetSocket } = useWebSocketStore((state) => state);

  const [loggingIn, setLoggingIn] = useState(false);

  socket.onclose = () => {
    navigation.navigate('connection_lost');
  };
  if (socket.readyState == 3) {
    navigation.navigate('connection_lost');
  }
  const { app_key, setCredentialStore, setLockedOut, isLockedOut } = useAppKey((state) => state);

  if (isLockedOut) {
    navigation.navigate('locked_out');
  }

  const handle_message = (event: any) => {
    if (event.data == 'Login Successful') {
      navigation.navigate('home');
    } else {
      setLockedOut();
    }
  };
  useEffect(() => {
    subscribeToSocket(handle_message);
  }, []);

  const handle_login_submit = async () => {
    if (isLockedOut) {
      return;
    }

    if (socket.readyState == 3) {
      navigation.navigate('connection_lost');
      return;
    }
    setLoggingIn(true);
    if (app_key != '') {
      await socket.send(
        JSON.stringify({
          email: loginCredentials?.email,
          password: loginCredentials?.password,
          app_key,
        })
      );
    } else {
      await axios
        .post('https://digitalis.JakubSzamuk.co.uk/configure-client', {
          auth_object: {
            email: loginCredentials?.email,
            password: loginCredentials?.password,
          },
          app_key: TEMP_APP_KEY,
        })
        .then((data) => {
          socket.send(
            JSON.stringify({
              email: loginCredentials?.email,
              password: loginCredentials?.password,
              app_key: data.data.app_key,
            })
          );
          setCredentialStore(data.data);
        });
    }
  };

  return (
    <SafeAreaView>
      <StandardBackground style={UtilityStyles.mainBackground}>
        <View style={{ paddingTop: 132, flex: 1 }}>
          <Text style={[FontStyles.Header, { marginLeft: 42, marginBottom: 50 }]}>Sign in</Text>

          <TextInput
            placeholder="Username"
            onChangeText={(text: string) =>
              setLoginCredentials({ password: '', ...loginCredentials, email: text })
            }
            placeholderTextColor={Color.text}
            style={[FontStyles.StandardText, { marginLeft: 42, marginBottom: -6 }]}
          />
          <View style={{ alignItems: 'center', width: '100%' }}>
            <StandardBackground withBorder style={{ width: '80%', height: 5 }} />
          </View>

          <TextInput
            placeholder="Password"
            onChangeText={(text: string) =>
              setLoginCredentials({ email: '', ...loginCredentials, password: text })
            }
            placeholderTextColor={Color.text}
            style={[FontStyles.StandardText, { marginLeft: 42, marginBottom: -6, marginTop: 30 }]}
          />
          <View style={{ alignItems: 'center', width: '100%' }}>
            <StandardBackground withBorder style={{ width: '80%', height: 5, borderRadius: 3 }} />
            <TouchableOpacity style={{ marginTop: 50 }} onPress={handle_login_submit}>
              <StandardBackground withBorder style={{ borderRadius: 3 }}>
                <View
                  style={{
                    width: 212,
                    height: 52,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {loggingIn ? (
                    <ActivityIndicator />
                  ) : (
                    <Text style={FontStyles.StandardText}>Login</Text>
                  )}
                </View>
              </StandardBackground>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center', width: '100%', marginBottom: 20 }}>
          <Logo />
        </View>
      </StandardBackground>
    </SafeAreaView>
  );
};

export default Login;
