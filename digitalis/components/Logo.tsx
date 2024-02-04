import { View, Text } from 'react-native'
import React from 'react'
import { FontStyles } from '@/styles/text'
import { Color } from '@/constants/colors'

const Logo = () => {
  return (
    <View>
      <Text style={[FontStyles.Logo, { color: Color.text, marginLeft: 10 }]}>DIGITALIS</Text>
      <Text style={[FontStyles.Logo, { color: "#afafaf0f", marginTop: -36 }]}>DIGITALIS</Text>
    </View>
  )
}

export default Logo