import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Color, StandardBackground } from '../../../constants/colors'
import { UtilityStyles } from '../../../styles/utility'
import { FontStyles } from '../../../styles/text'
import { CaretLeft } from 'phosphor-react-native'
import Logo from '../../reusable/Logo'





const ShowQr = ({ navigation }) => {

  
  return (
    <SafeAreaView>
      <StandardBackground style={UtilityStyles.mainBackground}>
        <View style={{ alignItems: 'center', width: "100%", marginTop: 110, flex: 1 }}>
          <View>
            <Text style={FontStyles.MediumText}>Message Encryption Key</Text>
            <View style={{ height: 320, width: 320, borderRadius: 8, backgroundColor: Color.secondary }}>
              {/* Qr code here */}
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View style={{ flex: 1, marginLeft: -10 }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate("add_chat")}>
                  <CaretLeft color={Color.text} size={48} />
                  <Text style={[FontStyles.StandardText, { marginLeft: -12 }]}>Back</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("scan_qr")}>
                <StandardBackground withBorder style={{ borderRadius: 2, width: 212, height: 52 }}>
                  {/* Logic for which text to show */}
                  <View style={{ height: "100%", justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={FontStyles.StandardText}>Scan other QR</Text>
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