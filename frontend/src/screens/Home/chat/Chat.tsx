import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Color, StandardBackground } from '../../../constants/colors'
import { UtilityStyles } from '../../../styles/utility'
import { CaretLeft } from 'phosphor-react-native'
import { FontStyles } from '../../../styles/text'

// const ChatMessage = () => {
//   return (

//   )
// }



const Chat = () => {
  return (
    <SafeAreaView>
      <StandardBackground style={UtilityStyles.mainBackground}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: 18 }}>
          <TouchableOpacity>
            <CaretLeft color={Color.text} size={48} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
            <View style={{ backgroundColor: Color.secondary, width: 76, height: 76, borderRadius: 4, elevation: 20, shadowColor: Color.secondary }}></View>
            <View style={{ marginLeft: 8 }}>
              <Text style={FontStyles.Header}>Jakub Szamuk</Text>
              <Text style={FontStyles.StandardText}>100 Messages Left</Text>
            </View>
          </View>
        </View>
        <StandardBackground withBorder style={{ borderRadius: 10, marginTop: 10, elevation: 20, shadowColor: Color.primary }}>
          <View style={{ width: "100%", height: "100%" }}>

          </View>
        </StandardBackground>
      </StandardBackground>
    </SafeAreaView>
  )
}

export default Chat