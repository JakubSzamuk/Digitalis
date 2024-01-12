import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';
import { CaretLeft } from 'phosphor-react-native';
import React, { useEffect } from 'react';
import { View, Text, PermissionsAndroid, TouchableOpacity } from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';

import { Color, StandardBackground } from '../../../constants/colors';
import useContactsStore, { StoredContact } from '../../../stores/Contacts';
import { FontStyles } from '../../../styles/text';
import { UtilityStyles } from '../../../styles/utility';
import Logo from '../../reusable/Logo';

const ScanQr = ({ navigation }: NativeStackHeaderProps) => {
  const { tempContact, setTempContact } = useContactsStore((state) => state);

  const onSuccess = (e: { rawData: string }) => {
    let data;
    const decodedData = [];

    try {
      data = e.rawData.slice(5, parseInt(e.rawData.slice(1, 5), 16) * 2 + 6);

      for (let i = 0; i <= data.length - 2; i += 2) {
        decodedData.push(parseInt(data.slice(i, i + 2), 16));
      }
    } catch {
      return;
    }
    setTempContact({ id: decodedData[0], incoming_key: decodedData.slice(1, decodedData.length) });

    // checks to see which route to go to next, based on which props have been filled on the temporary contact.
    if (tempContact.outgoing_key != undefined) {
      navigation.navigate('added_contact');
    } else {
      navigation.navigate('show_qr');
    }
  };

  return (
    <StandardBackground style={UtilityStyles.mainBackground}>
      {/* <QRCodeScanner onRead={onSuccess as any} /> */}
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 60, marginTop: -110 }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}
            onPress={() => navigation.navigate('home')}>
            <CaretLeft color={Color.text} size={48} />
            <Text style={[FontStyles.StandardText, { marginLeft: -12 }]}>Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={[FontStyles.ExtraSmall, { marginRight: 20 }]}>
          Please scan the recipients QR code
        </Text>
      </View>
      <View style={{ marginBottom: 10, alignItems: 'center', width: '100%' }}>
        <Logo />
      </View>
    </StandardBackground>
  );
};

export default ScanQr;
