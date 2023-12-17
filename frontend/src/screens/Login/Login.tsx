import { View, Text } from 'react-native'
import React from 'react'
import { StandardBackground } from '../../constants/colors'
import { UtilityStyles } from '../../styles/utility'

// const InputField


const Login = () => {
  return (
    <StandardBackground style={UtilityStyles.mainBackground}>
      <Text>Sign in</Text>
    </StandardBackground>
  )
}

export default Login