import { View, Text, TextInput, TouchableHighlight, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import { Color, StandardBackground } from '../../constants/colors'
import { UtilityStyles } from '../../styles/utility'
import { FontStyles } from '../../styles/text'
import Logo from '../reusable/Logo'

// const InputField


const Login = () => {
  return (
    <SafeAreaView>
      <StandardBackground style={UtilityStyles.mainBackground}>
        <View style={{ paddingTop: 132, flex: 1  }}>
          <Text style={[FontStyles.Header, { marginLeft: 42, marginBottom: 50 }]}>Sign in</Text>

          <TextInput placeholder='Username' placeholderTextColor={Color.text} style={[FontStyles.StandardText, { marginLeft: 42, marginBottom: -6 }]} />
          <View style={{ alignItems: "center", width: "100%" }}>
            <StandardBackground withBorder style={{ width: "80%", height: 5 }}></StandardBackground>
          </View>

          <TextInput placeholder='Password' placeholderTextColor={Color.text} style={[FontStyles.StandardText, { marginLeft: 42, marginBottom: -6, marginTop: 30 }]} />
          <View style={{ alignItems: "center", width: "100%" }}>
            <StandardBackground withBorder style={{ width: "80%", height: 5 }}></StandardBackground>
            <TouchableOpacity style={{ marginTop: 50 }}>
              <StandardBackground withBorder>
                <View style={{ width: 212, height: 52, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={FontStyles.StandardText}>
                    Login
                  </Text>
                </View>
              </StandardBackground>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center', width: "100%", marginBottom: 20 }}>
          <Logo />
        </View>
      </StandardBackground>
    </SafeAreaView>
  )
}

export default Login