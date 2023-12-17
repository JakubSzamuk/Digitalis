import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import LinearGradient from "react-native-linear-gradient"

export const Color = {
  'text': '#e1e9ea',
  'background': '#070a0a',
  'primary': '#a2c0c6',
  'secondary': '#3a5f65',
  'accent': '#69a5b0',
}


export const StandardBackground = ({ children, style, withBorder }: { children: ReactNode, style?: ViewStyle, withBorder?: boolean }) => {
  if (withBorder) {
    return (
      <LinearGradient colors={["#303337", "#1D2326"]} style={{ padding: 2 }}>
        <LinearGradient
          colors={["#25292E", "#212427"]}
        >
          <View style={style}>{children}</View>
        </LinearGradient>
      </LinearGradient>
    );
  } else {
    return (
      <LinearGradient
        colors={["#25292E", "#212427"]}
      >
        <View style={style}>{children}</View>
      </LinearGradient>
    )
  }
};