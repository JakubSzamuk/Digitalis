import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StandardBackground } from '@/constants/colors'
import Logo from '@/components/Logo'
import { UtilityStyles } from '@/styles/utility'
import { FontStyles } from '@/styles/text'

const OutOfChats = ({ route, navigation }: any) => {
  return (
    <SafeAreaView>
      <StandardBackground style={UtilityStyles.mainBackground}>
        <View style={{ width: "100%", alignItems: 'center' }}>
          <View style={{ marginTop: 200, marginBottom: 40 }}>
            <Text style={FontStyles.Header}>Out of Messages.</Text>
            <Text style={FontStyles.StandardText}>You have ran out of messages. You can reuse the key, but this will compromise the security of your chat</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("chat", { recipient_id: route.params.recipient_id, no_warn: true })}>
            <StandardBackground withBorder style={{ width: 210, height: 52, borderRadius: 2 }}>
              <View style={{ alignItems: 'center', justifyContent: 'center', height: "100%" }}>
                <Text style={FontStyles.StandardText}>Ok</Text>
              </View>
            </StandardBackground>
          </TouchableOpacity>
          <View style={{ marginTop: '96%' }}>
            <Logo />
          </View>
        </View>
      </StandardBackground>
    </SafeAreaView>
  )
}

export default OutOfChats