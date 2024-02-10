import { Text, TouchableOpacity, SafeAreaView, StyleSheet } from "react-native";
import React from "react";

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
  makeDiscoverable,
  startDiscovery,
} from "@/modules/digitalis-share";

type loginCredentials = {
  email: String;
  password: String;
};

const Test = () => {
  return (
    <SafeAreaView>
      <StandardBackground style={UtilityStyles.mainBackground}>
        <TouchableOpacity
          style={[styles.button, { marginTop: 80 }]}
          onPress={() => initialise()}
        >
          <Text>Initialise</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            addDiscoveryListener((e) => console.log(e));
            startDiscovery();
          }}
        >
          <Text>Start Discovery</Text>
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
