import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { Color, StandardBackground } from "@/constants/colors";
import useAppKey from "@/stores/CredentialStore";
import useWebSocketStore from "@/stores/Websocket";
import { UtilityStyles } from "@/styles/utility";
import { FontStyles } from "@/styles/text";
import Logo from "@/components/Logo";
import { useRouter } from "expo-router";

const TEMP_APP_KEY = "7df175e08558c2916ec12e654ce790fe";
const BACKEND_URL = "BACKEND_URL";

import {
  requireNativeModule,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

import {
  addDiscoveryListener,
  connectTo,
  initialise,
  makeDiscoverable,
  startDiscovery,
} from "@/modules/digitalis-share";

type loginCredentials = {
  email: String;
  password: String;
};

const LoginScreen = ({ navigation }: any) => {
  const router = useRouter();

  const [loginCredentials, setLoginCredentials] =
    useState<loginCredentials | null>(null);
  const { socket, subscribeToSocket, resetSocket } = useWebSocketStore(
    (state) => state
  );

  const [loggingIn, setLoggingIn] = useState(false);

  socket.onclose = () => {
    navigation.navigate("connection_lost");
  };
  if (socket.readyState == 3) {
    navigation.navigate("connection_lost");
  }
  const { app_key, setCredentialStore, setLockedOut, isLockedOut } = useAppKey(
    (state) => state
  );

  if (isLockedOut) {
    navigation.navigate("locked_out");
  }

  const handle_message = (event: any) => {
    if (event.data == "Login Successful") {
      router.navigate("/Home");
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
      navigation.navigate("connection_lost");
      return;
    }
    setLoggingIn(true);
    if (app_key != "") {
      await socket.send(
        JSON.stringify({
          email: loginCredentials?.email,
          password: loginCredentials?.password,
          app_key: app_key,
        })
      );
    } else {
      await axios
        .post("https://digitalis.JakubSzamuk.co.uk/configure-client", {
          auth_object: {
            email: loginCredentials?.email,
            password: loginCredentials?.password,
          },
          app_key: TEMP_APP_KEY,
        })
        .then((data) => {
          console.log(app_key);
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
          <Text
            style={[FontStyles.Header, { marginLeft: 42, marginBottom: 50 }]}
          >
            Sign in
          </Text>
          <TouchableOpacity onPress={() => initialise()}>
            <Text>Initialise</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              addDiscoveryListener((e) => console.log(e));
              startDiscovery();
            }}
          >
            <Text>Start Discovery</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => makeDiscoverable()}>
            <Text>Make Discoverable</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => connectTo("hello world testing one two")}
          >
            <Text>Connect to</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Username"
            onChangeText={(text: String) =>
              setLoginCredentials({
                password: "",
                ...loginCredentials,
                email: text,
              })
            }
            placeholderTextColor={Color.text}
            style={[
              FontStyles.StandardText,
              { marginLeft: 42, marginBottom: -6 },
            ]}
          />
          <View style={{ alignItems: "center", width: "100%" }}>
            <StandardBackground
              withBorder
              style={{ width: "80%", height: 5 }}
            ></StandardBackground>
          </View>

          <TextInput
            placeholder="Password"
            onChangeText={(text: String) =>
              setLoginCredentials({
                email: "",
                ...loginCredentials,
                password: text,
              })
            }
            placeholderTextColor={Color.text}
            style={[
              FontStyles.StandardText,
              { marginLeft: 42, marginBottom: -6, marginTop: 30 },
            ]}
          />
          <View style={{ alignItems: "center", width: "100%" }}>
            <StandardBackground
              withBorder
              style={{ width: "80%", height: 5, borderRadius: 3 }}
            ></StandardBackground>
            <TouchableOpacity
              style={{ marginTop: 50 }}
              onPress={handle_login_submit}
            >
              <StandardBackground withBorder style={{ borderRadius: 3 }}>
                <View
                  style={{
                    width: 212,
                    height: 52,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
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
        <View style={{ alignItems: "center", width: "100%", marginBottom: 20 }}>
          <Logo />
        </View>
      </StandardBackground>
    </SafeAreaView>
  );
};

export default LoginScreen;
