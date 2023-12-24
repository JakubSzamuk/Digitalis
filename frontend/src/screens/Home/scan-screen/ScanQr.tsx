import { View, Text, PermissionsAndroid, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner';
import useContactsStore, { StoredContact } from '../../../stores/Contacts';
import { Color, StandardBackground } from '../../../constants/colors';
import { UtilityStyles } from '../../../styles/utility';
import { FontStyles } from '../../../styles/text';
import { CaretLeft } from 'phosphor-react-native';
import Logo from '../../reusable/Logo';

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
    <StandardBackground style={UtilityStyles.mainBackground}>
      <QRCodeScanner onRead={onSuccess} />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 60, marginTop: -110 }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }} onPress={() => navigation.navigate("home")}>
            <CaretLeft color={Color.text} size={48} />
            <Text style={[FontStyles.StandardText, { marginLeft: -12 }]}>Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={[FontStyles.ExtraSmall, { marginRight: 20 }]}>Please scan the recipients QR code</Text>
      </View>
      <View style={{ marginBottom: 10, alignItems: 'center', width: "100%" }}>
        <Logo />
      </View>
    </StandardBackground>
  )
}

export default ScanQr