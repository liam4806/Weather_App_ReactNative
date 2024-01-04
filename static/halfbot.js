import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const halfbot = StyleSheet.create({
  weas: {
    flex: 10,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  forcastdiv: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cec8c886",
    borderRadius: 15,
    marginTop: -20,
    paddingVertical: 20,
  },
  forcast: {
    width: width * 0.9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  forcast_text: {
    fontSize: 30,
    marginHorizontal: 15,
    padding: 10,
    fontWeight: "400",
    textAlign: "center",
  },
});
module.exports = halfbot;