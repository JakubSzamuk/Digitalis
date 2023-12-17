import { StyleSheet } from "react-native";
import { Color } from "../constants/colors";

const FontStyles = StyleSheet.create({
  Logo: {
    fontSize: 32,
    fontWeight: "600",
    fontFamily: "Nunito-Variable",
    letterSpacing: 33,
  },
  Header: {
    color: Color.text,
    fontSize: 36,
    fontWeight: "500",
    fontFamily: "Nunito-Variable",
  },
  StandardText: {
    color: Color.text,
    fontSize: 20,
    fontWeight: "400",
    fontFamily: "Nunito-Variable",
  },
  ExtraSmall: {
    color: Color.text,
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Nunito-Variable",    
  }
});