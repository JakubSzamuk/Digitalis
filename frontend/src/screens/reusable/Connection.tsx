import React from 'react';
import { View, Text, SafeAreaView, TouchableHighlight, TouchableOpacity } from 'react-native';

import Logo from './Logo';
import { StandardBackground } from '../../constants/colors';
import useWebSocketStore from '../../stores/Websocket';
import { FontStyles } from '../../styles/text';
import { UtilityStyles } from '../../styles/utility';

const Connection = ({ navigation }: any) => {
  const { socket, resetSocket } = useWebSocketStore((state) => state);

  const retry = () => {
    resetSocket(() => {
      navigation.navigate('login');
    });
  };

  return (
    <SafeAreaView>
      <StandardBackground style={UtilityStyles.mainBackground}>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <View style={{ marginTop: 200, marginBottom: 40 }}>
            <Text style={FontStyles.Header}>Connection Lost.</Text>
            <Text style={FontStyles.StandardText}>Please try again...</Text>
          </View>
          <TouchableOpacity onPress={retry}>
            <StandardBackground withBorder style={{ width: 210, height: 52, borderRadius: 2 }}>
              <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Text style={FontStyles.StandardText}>Retry</Text>
              </View>
            </StandardBackground>
          </TouchableOpacity>
          <View style={{ marginTop: '96%' }}>
            <Logo />
          </View>
        </View>
      </StandardBackground>
    </SafeAreaView>
  );
};

export default Connection;
