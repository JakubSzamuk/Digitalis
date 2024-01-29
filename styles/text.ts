import { StyleSheet } from "react-native";
import { Color } from "../constants/colors";

export const FontStyles = StyleSheet.create({
  Logo: {
    fontSize: 32,
    fontFamily: "Nunito-Medium",
    letterSpacing: 12,
  },
  Header: {
    color: Color.text,
    fontSize: 36,
    fontFamily: "Nunito-SemiBold",
  },
  StandardText: {
    color: Color.text,
    fontSize: 22,
    fontFamily: "Nunito-Regular",
  },
  MediumText: {
    color: Color.text,
    fontSize: 16,
    fontFamily: "Nunito-Regular",
  },
  ExtraSmall: {
    color: Color.text,
    fontSize: 14,
    fontFamily: "Nunito-Regular",
  }
});