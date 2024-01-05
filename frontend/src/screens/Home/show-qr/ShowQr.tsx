import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Color, StandardBackground } from '../../../constants/colors'
import { UtilityStyles } from '../../../styles/utility'
import { FontStyles } from '../../../styles/text'
import { CaretLeft } from 'phosphor-react-native'
import Logo from '../../reusable/Logo'

import { generateSecureRandom } from 'react-native-securerandom';
import QRCode from 'react-native-qrcode-svg'
import useAppKey from '../../../stores/CredentialStore'
import useContactsStore from '../../../stores/Contacts'

type QRValue = {
  data: Uint8ClampedArray,
  mode: "byte"
}


const ShowQr = ({ navigation }: any) => {
  const [qrValue, setQrValue] = useState<QRValue[]>() 

  const { user_id } = useAppKey((state) => state);
  const { tempContact, setTempContact } = useContactsStore((state) => state);


  const generate_qr_code = async () => {
    let key = await generateSecureRandom(2300);
    let clampedKey = new Uint8ClampedArray([parseInt(user_id), ...key]);

    setTempContact({ outgoing_key: key });

    setQrValue([{ data: clampedKey, mode: "byte"}]);
  };
  useEffect(() => {
    generate_qr_code();
  }, [])

  const submit_step = () => {
    if (tempContact.id != undefined) {
      navigation.navigate("added_contact");
    } else {
      navigation.navigate("scan_qr");
    }
  }
    
  return (
    <SafeAreaView>
      <StandardBackground style={UtilityStyles.mainBackground}>
        <View style={{ alignItems: 'center', width: "100%", marginTop: 110, flex: 1 }}>
          <View>
            <Text style={FontStyles.MediumText}>Message Encryption Key</Text>
            <View style={{ height: 320, width: 320, borderRadius: 8, backgroundColor: Color.secondary, justifyContent: 'center', alignItems: 'center' }}>
              {
                qrValue != undefined ? (
                  <View style={{ backgroundColor: "#ffffff", padding: 12, borderRadius: 2 }}>
                    <QRCode
                      size={260}
                      value={qrValue as any}
                      ecl='M'
                      onError={() => {setQrValue(undefined); generate_qr_code()}}
                    />
                  </View>
                ) : (
                  <ActivityIndicator size="large" color={Color.text} />
                )
              }
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View style={{ flex: 1, marginLeft: -10 }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate("add_chat")}>
                  <CaretLeft color={Color.text} size={48} />
                  <Text style={[FontStyles.StandardText, { marginLeft: -12 }]}>Back</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={submit_step}>
                <StandardBackground withBorder style={{ borderRadius: 2, width: 212, height: 52 }}>
                  {/* Logic for which text to show */}
                  <View style={{ height: "100%", justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={FontStyles.StandardText}>{tempContact.id != undefined ? "Finish" : "Scan other QR"}</Text>
                  </View>
                </StandardBackground>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ width: "100%", alignItems: 'center', marginBottom: 20 }}>
          <Logo />
        </View>
      </StandardBackground>
    </SafeAreaView>
  )
}

export default ShowQr