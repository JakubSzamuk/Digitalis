import { View, Text, PermissionsAndroid, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner';

const ScanQr = () => {
  const onSuccess = (e) => {
    console.log(e.data);
  }

  return (
    <QRCodeScanner onRead={onSuccess} />
  )
}

export default ScanQr