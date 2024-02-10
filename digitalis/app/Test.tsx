import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import React, { useState } from "react";

import { StandardBackground } from "@/constants/colors";
import { UtilityStyles } from "@/styles/utility";
import { useRouter } from "expo-router";

import {
  requireNativeModule,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

import {
  addDiscoveryListener,
  connectTo,
  initialise,
  isInitialised,
  makeDiscoverable,
  startDiscovery,
  stopDiscovery,
} from "@/modules/digitalis-share";

type loginCredentials = {
  email: String;
  password: String;
};

const Test = () => {
  const [isSetup, setIsSetup] = useState<boolean | null>(null);
  const [foundDevices, setFoundDevices] = useState<String>("init");

  return (
    <SafeAreaView>
      <StandardBackground style={UtilityStyles.mainBackground}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              marginTop: 80,
              backgroundColor: isSetup
                ? "#0f0"
                : isSetup == false
                ? "#f00"
                : "#fff",
            },
          ]}
          onPress={() => {
            initialise();
            setIsSetup(isInitialised());
          }}
        >
          <Text>Initialise</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            addDiscoveryListener((e) => {
              setFoundDevices((old) => old + " " + JSON.stringify(e));
              console.log(e);
            });
            startDiscovery();
          }}
        >
          <Text>Start Discovery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            stopDiscovery();
            setFoundDevices("init");
          }}
        >
          <Text>Stop Discovery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => makeDiscoverable()}
        >
          <Text>Make Discoverable</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => connectTo("hello world testing one two")}
        >
          <Text>Connect to</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20 }}>
          <Text>{foundDevices}</Text>
        </View>
      </StandardBackground>
    </SafeAreaView>
  );
};

export default Test;

const styles = StyleSheet.create({
  button: {
    padding: 16,
    backgroundColor: "#fff",
    margin: 10,
  },
});
