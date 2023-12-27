import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import LinearGradient from "react-native-linear-gradient"

export const Color = {
  'text': '#AFAFAF',
  'background': '#070a0a',
  'primary': '#AFAFAF',
  'secondary': '#1A1A1A',
  'accent': '#69a5b0',
  'shadow': '#32363D'
}



export const StandardBackground = ({ children, style, withBorder }: { children?: ReactNode, style?: ViewStyle, withBorder?: boolean }) => {
  if (withBorder) {
    return (
      <LinearGradient colors={["#303337", "#1D2326"]} style={{ padding: 2, borderRadius: 3, elevation: 12, shadowColor: Color.shadow, ...style }}>
        <LinearGradient
          colors={["#25292E", "#212427"]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0.2}}
          style={{ borderRadius: style?.borderRadius || 3 }}
        >
          <View style={style}>{children}</View>
        </LinearGradient>
      </LinearGradient>
    );
  } else {
    return (
      <LinearGradient
        colors={["#25292E", "#212427"]}
        start={{x: 0, y: 0}} end={{x: 1, y: 0.2}}
      >
        <View style={style}>{children}</View>
      </LinearGradient>
    )
  }
};