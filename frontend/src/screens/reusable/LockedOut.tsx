import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

import Logo from './Logo';
import { StandardBackground } from '../../constants/colors';
import { FontStyles } from '../../styles/text';
import { UtilityStyles } from '../../styles/utility';

const LockedOut = () => {
  return (
    <SafeAreaView>
      <StandardBackground style={UtilityStyles.mainBackground}>
        <View style={{ marginTop: 120, paddingHorizontal: 40 }}>
          <Text style={FontStyles.Header}>Uh oh,</Text>
          <Text style={FontStyles.MediumText}>
            Looks like you have been locked out for entering the incorrect credentials, please
            contact the administrator to login
          </Text>
        </View>
        <View style={{ width: '100%', alignItems: 'center', position: 'absolute', bottom: 12 }}>
          <Logo />
        </View>
      </StandardBackground>
    </SafeAreaView>
  );
};

export default LockedOut;
