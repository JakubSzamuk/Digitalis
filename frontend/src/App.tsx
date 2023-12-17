/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Color } from './constants/colors';

function Seperator(): React.JSX.Element {
  return (
    <View style={styles.centerView}><View style={styles.innerSeperatorView} /></View>
  )
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';


  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <View style={styles.centerView}>
        <Text style={styles.textStyle}>
          {"    "}    .___.__{"       "}.__{"  "}__{"         "}.__{"  "}.__{"        "}{"\n"}
          {"  "}  __| _/|__| ____ |__|/{"  "}|______{"  "}|{"  "}| |__| ______{"\n"}
          {" "} / __ | |{"  "}|/ ___\|{"  "}\{"   "}__\__{"  "}\ |{"  "}| |{"  "}|/{"  "}___/{"\n"}
          / /_/ | |{"  "}/ /_/{"  "}>{"  "}||{"  "}|{"  "}/ __ \|{"  "}|_|{"  "}|\___ \ {"\n"}
          \____ | |__\___{"  "}/|__||__| (____  /____/__/____  >{"\n"}
          {"     "}     \/{"   "}/_____/{"               "}\/{"             "}\/ {"\n"}
        </Text>
      </View>
      <Seperator />
      <View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: Color.background,
    width: "100%",
    height: "100%"
  },
  textStyle: {
    color: Color.text,
  },
  centerView: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  innerSeperatorView: {
    width: "80%",
    height: 1,
    backgroundColor: Color.accent
  }
});

export default App;

