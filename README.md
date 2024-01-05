# Weather App Using React Native

<img width="370" alt="weather simul" src="https://github.com/liam4806/Weather_App_ReactNative/assets/95008167/7578efb4-211c-4874-85ed-2536d19d5b4d">

<img width="370" alt="weather app simulator" src="https://github.com/liam4806/Weather_App_ReactNative/assets/95008167/8a4ceb5e-4631-4095-8f69-423475cb469e">

#### Tech Stack: React Native, JavaScript

#### API: https://openweathermap.org/forecast5

Used API from the OpenWeather. This API returns a 5-day forecast data with a 3-hour step. Since another API charges for API calls, I decided to use this free API and **perform data wrangling to fit in an intended usage**.

## Retrieving data
```
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
```
Used Expo Location to get coordinate data for the API call. 

## Sample API Response

```
{
  "cod": "200",
  "message": 0,
  "cnt": 40,
  "list": [
    {
      "dt": 1661871600,
      "main": {
        "temp": 296.76,
        "feels_like": 296.98,
        "temp_min": 296.76,
        "temp_max": 297.87,
        "pressure": 1015,
        "sea_level": 1015,
        "grnd_level": 933,
        "humidity": 69,
        "temp_kf": -1.11
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": {
        "all": 100
      },
      "wind": {
        "speed": 0.62,
        "deg": 349,
        "gust": 1.18
      },
      "visibility": 10000,
      "pop": 0.32,
      "rain": {
        "3h": 0.26
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2022-08-30 15:00:00"
    },
}
```
The full API response sample is available [here](https://openweathermap.org/forecast5)

# Data Wrangling

## Daily Forcast
```
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
```

**gettoday is a function to save data that are for today's forecast. Elements in gettoday are used for the upper half of the application.** 

It will save the **latest 7 forecasts (21hours)**. Extract "dt_txt" which is a date and time data inside the JSON and **convert the time into our local time**. Then, the data will be pushed to the array todaylist as an array with **Time(PM/AM)**, **temperature**, **Icon(weather icon)**, and **Description**. 

Therefore, for **current weather** which is displayed on the top of the application, the **first element in todaylist is used**. 

The data in this list is used to show the forecast for 21 hours with ScrollView in the middle of the app. 

## Weekly Forcast

```
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
```

**getweek is a function to save data for the weekly forecast. Elements in getweek are used for the lower half of the application.** 

### Sorting Minimum temperature and Maximum temperature

It will save **10 forecasts**. The function will **iterate through the entire JSON** file and **convert the time to the local timezone**. By slicing the date string, it will give a **day data** such as "Tue", "Fri" ..etc. If the **day is not today** which means the **data is for the future forecast**, it will be stored **only if the forecast is for 6 AM and 3 PM**. 


The reason why I picked 6 AM and 3 PM is, since the **response from this API does not contain the minimum and maximum temperature of the day**, I picked two times, **6 AM** for the **minimum temperature**, and **3 PM** for the **maximum temperature** of the day. 

### Storing in Object

The data will be **stored in an array finallist as an object**. Using an **object is to store minimum & maximum temperature in one object** for convenience and an **array** is used to **store it sequentially** so we don't have to wrangle the data again while displaying. 


The **key of the object** is the **day** such as **"Tue", "Fri"..etc**. And since the **original data from the API response** is in **chronological sequence**, the **first element will always be the data of 6 AM**. So it will **create an object with the key of the day** if that object with that **day does not exist** (6 AM data) and save the **Day(ex: Tue, Fri...etc)**, **Weather Icon**, and **minimum temperature**. If the object with the **key of that day exists** (3 PM data), it will add a **maximum temperature of that data**. 


Therefore, **it can contain both minimum and maximum temperature in one object**.  

### Pushing to the final array

Since **each day has to be stored twice (with min temp and max temp)**, I used a count so if the count is 1(starts from 0), it will push the current object and initialize the count to 0 again. Therefore, this function will **push the objects in the array whenever the object has both min and max temperature**. 

The data of the finallist is used for the lower half of the application to show the weekly forecast.

