import { View, Text, PermissionsAndroid, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner';

const ScanQr = ({ navigation }) => {
  const onSuccess = (e) => {
    console.log(e.data);
    // navigation.navigate()
  }

  return (
    <QRCodeScanner onRead={onSuccess} />
  )
}

export default ScanQr