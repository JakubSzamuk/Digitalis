import { View, Text, PermissionsAndroid } from 'react-native'
import React, { useEffect } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Digitalis Camera Permissions',
        message:
          'Digitalis Would like to access your camera' +
          'to be able to scan the QR code',
        buttonNegative: 'Dont Allow',
        buttonPositive: 'Allow',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const ScanQr = () => {
  const onSuccess = (e) => {
    console.log(e.data);
  }
  useEffect(() => {
    requestCameraPermission()
  }, [])
  if (PermissionsAndroid.RESULTS.GRANTED) {
    return (
      <QRCodeScanner onRead={onSuccess} />
    )
  }
  else {
    return (
      <Text>Give permissions please</Text>
    )
  }
}

export default ScanQr