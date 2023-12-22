import { View, Text, PermissionsAndroid, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner';
import useContactsStore, { StoredContact } from '../../../stores/Contacts';

const ScanQr = ({ navigation }) => {
  const { tempContact, setTempContact } = useContactsStore((state) => state);

  const onSuccess = (e) => {
    setTempContact({ ...JSON.parse(e.data) })
    // Format of QR code will include recipient's id and there key

    if (tempContact.outgoing_key != undefined) {
      navigation.navigate("added_contact")
    } else {
      navigation.navigate("show_qr")
    }
  }

  return (
    <QRCodeScanner onRead={onSuccess} />
  )
}

export default ScanQr