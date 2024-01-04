import { StatusBar } from 'expo-status-bar';
import * as Location from "expo-location";
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Image, ActivityIndicator} from 'react-native';
import halftop from "./static/halftop";
import halfbot from "./static/halfbot";
import API_KEY from './configuration/keys';

export default function App() {
  const [cityname, setCityname] = useState("Loading");
  const [todayweather, settodayweather] = useState([]);
  const [forcast, setforcast] = useState([]);
  const [ok,setok] = useState(true);
  const getPermission = async() =>{
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setok(false);
      }
      const locat = await Location.getCurrentPositionAsync({});
      const {latitude, longitude} = locat.coords
      const cit = await Location.reverseGeocodeAsync({latitude,longitude})
      setCityname(cit[0].city);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY.key}`
      );
      const json= await response.json();
      if (json.cod !== "200"){
        setok(false);
      }
        
    setforcast((cur) => getweek(json.list));
    settodayweather((cur) => gettoday(json.list));
  } 
  const gettoday = (arr)=>{
    const todaylist = [];
    for(let i=0; i<7; i++){
    const timedate = new Date(arr[i].dt_txt);
    const newtime = timedate.getTime() - timedate.getTimezoneOffset() * 60000;
    const t = new Date(newtime);
    todaylist.push([
      t.toLocaleString("en-US", { hour: "numeric", hour12: true }),
      Math.round(arr[i].main.temp - 273.15),
      arr[i].weather[0].icon,
      arr[i].weather[0].description,
    ]);
    }
    return todaylist
  }
  const getweek = (arr)=>{
    const weeklist = {};
    const finallist = [];
    let count = 0;
    arr.forEach((element)=>{
    const timedate = new Date(element.dt_txt);
    const newtime = timedate.getTime() - timedate.getTimezoneOffset() * 60000;
    const t = new Date(newtime);
    const now = new Date();
    const datestring = t.toString()
    if(now.toString().slice(0,3)!==datestring.slice(0,3)){
      if (
        datestring.slice(16, 21) == "06:00" ||
        datestring.slice(16, 21) == "15:00"
      ) {
        if (weeklist[datestring.slice(0, 3)]) {
          weeklist[datestring.slice(0, 3)].temp_max = Math.round(
            element.main.temp_max - 273.15
          );
          count = count + 1;
        } else {
          weeklist[datestring.slice(0, 3)] = {
            day: datestring.slice(0, 3),
            weather: element.weather[0].icon,
            temp_min: Math.round(element.main.temp_min - 273.15),
          };
        }
        if (count === 1) {
          finallist.push(weeklist[datestring.slice(0, 3)]);
          count = 0;
        }
      }
    }
});
return finallist
}
    
  
useEffect(()=>{
  getPermission();
},[])
  if (todayweather.length===0) {
    return (
      <View style={halftop.container}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <View style={halftop.container}>
      {todayweather.length === 0 ? (
        <View style={halftop.container}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={halftop.city}>
          <Text style={halftop.city_text}>{cityname}</Text>
          <Text style={halftop.city_weather}>{todayweather[0][1]}°</Text>
          <Text style={halftop.city_stat}>{todayweather[0][3]}</Text>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${todayweather[0][2]}@2x.png`,
            }}
          ></Image>
        </View>
      )}
      <ScrollView
        pagingEnabled
        showsHorizontalScrollIndicator="true"
        horizontal
        indicatorStyle="white"
        contentContainerStyle={halftop.weather}
      >
        {todayweather.length === 0 ? (
          <View style={halftop.container}>
            <ActivityIndicator />
          </View>
        ) : (
          todayweather.map((ele, index) => (
            <View style={halftop.weather_day} key={index}>
              <Text style={halftop.weather_time} key={`${index}989`}>
                {ele[0]}
              </Text>
              <Text style={halftop.weather_text} key={`${index}987`}>
                {ele[1]}°
              </Text>
              <Image
                style={halftop.tinyLogo}
                key={`${index}984`}
                source={{
                  uri: `https://openweathermap.org/img/wn/${ele[2]}@2x.png`,
                }}
              ></Image>
            </View>
          ))
        )}
      </ScrollView>
      <View style={halfbot.weas}>
        <View style={halfbot.forcastdiv}>
          {forcast.length === 0 ? (
            <View style={halftop.container}>
              <ActivityIndicator />
            </View>
          ) : (
            forcast.map((ele, index) => (
              <View style={halfbot.forcast} key={index}>
                <Text style={halfbot.forcast_text} key={`${index}342`}>
                  {ele.day}
                </Text>
                <Image
                  style={halfbot.tinyLogo}
                  key={`${index}922`}
                  source={{
                    uri: `https://openweathermap.org/img/wn/${ele.weather}@2x.png`,
                  }}
                ></Image>
                <Text style={halfbot.forcast_text} key={`${index}345`}>
                  {ele.temp_min}°
                </Text>
                <Text style={halfbot.forcast_text} key={`${index}1234`}>
                  {ele.temp_max}°
                </Text>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  );
}


