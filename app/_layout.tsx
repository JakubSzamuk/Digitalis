import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const RootLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}} initialRouteName='Login'>      
      <Stack.Screen name='Login' />
      <Stack.Screen name='Home' />
    </Stack>
  )
}

export default RootLayout