import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const halftop = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  city: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: width,
    height: height / 3,
    paddingTop: 40,
  },
  weather: {
    backgroundColor: "#000",
    height: height / 7,
  },
  weather_day: {
    marginHorizontal: 2,
    width: width / 4,
    alignItems: "center",
    paddingTop: 30,
  },
  city_text: {
    fontSize: 40,
    fontWeight: "800",
  },
  city_weather: {
    fontSize: 85,
    fontWeight: "800",
  },
  city_stat: {
    fontSize: 20,
    fontWeight: "400",
  },
  weather_text: {
    fontSize: 40,
    fontWeight: "900",
    color: "white",
    marginBottom: -5,
  },
  weather_time: {
    fontSize: 15,
    fontWeight: "400",
    color: "white",
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});
module.exports = halftop;