// GeoCoding- http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// Current Weather- https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// 5 Day Weather- https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// &units=imperial for Fahrenheit -Thanks Drew
// &units=metric for Celsius -Thanks Drew
// &cnt=8 limits the 5 day weather to 8 responses -by default gives 8 per day / total of 40

import { apiKey } from './environment.js';

let cityInput = document.getElementById("cityInput");
let cityInputBtn = document.getElementById("cityInputBtn");

let cityName = document.getElementById("cityName");
let day0Temp = document.getElementById("day0Temp");
let day0Description = document.getElementById("day0Description");
let day0HighLow = document.getElementById("day0HighLow");

const d = new Date();
let weekDayLong = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
let weekDayShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

let day1Date = document.getElementById("day1Date");
let day2Date = document.getElementById("day2Date");
let day3Date = document.getElementById("day3Date");
let day4Date = document.getElementById("day4Date");
let day5Date = document.getElementById("day5Date");

let city = "Ripon, US"
let cityLat;
let cityLon;
let currentWeather;
let fiveDayReport;

cityInputBtn.addEventListener('click', function(){
    console.clear();
    city = cityInput.value;
    AsyncCityInput();
})

async function AsyncCityInput(){

    if(!fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey)) { return console.log("Unvalid Input"); }
    else {
        const promise = await fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey);
        const data = await promise.json();

        cityLat = data[0].lat;
        cityLon = data[0].lon;
        console.log(cityLat);
        console.log(cityLon);
        console.log("");


        console.log(data[0].name);
        cityName.textContent = data[0].name;
        AsyncGetCurrentWeather(cityLat, cityLon);
        Async5DayForcast(cityLat, cityLon);
    }
}

async function AsyncGetCurrentWeather(lat, lon){
    const promise = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial");
    const data = await promise.json();
    
    currentWeather = data;
    console.log(currentWeather);
    console.log("Current Day");
    console.log("   Current Temp Is: " + currentWeather.main.temp + "°F");
    day0Temp.textContent = Math.round(currentWeather.main.temp) + "°F";

    console.log("   Current Weather: " + currentWeather.weather[0].main);
    day0Description.textContent = currentWeather.weather[0].main;

    console.log("   Max Temp Today Is: " + currentWeather.main.temp_max + "°F");
    console.log("   Min Temp Today Is: " + currentWeather.main.temp_min + "°F");
    day0HighLow.textContent = "H:" + Math.round(currentWeather.main.temp_max) + "°F L:" + Math.round(currentWeather.main.temp_min) + "°F";
}

async function Async5DayForcast(lat, lon){
    const promise = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial");
    const data = await promise.json();
    
    fiveDayReport = data;
    console.log(fiveDayReport);
    console.log("");
    if((d.getDay() + 1) > 6) { day1Date.textContent = weekDayShort[d.getDay() + 1 - 7]; }
    else { day1Date.textContent = weekDayShort[d.getDay() + 1] }
    console.log("One Day Ahead");   // [0-7]
    console.log("   Morning Temp: " + fiveDayReport.list[3].main.temp + "°F")
    console.log("   Afternoon Temp: " + fiveDayReport.list[4].main.temp + "°F")
    console.log("   Evening Temp: " + fiveDayReport.list[7].main.temp + "°F")
    MaxTemp(fiveDayReport, 0, 7);
    MinTemp(fiveDayReport, 0, 7);
    console.log("   Weather Description: " + fiveDayReport.list[4].weather[0].description);
    console.log("");
    console.log("");
    if((d.getDay() + 2) > 6) { day2Date.textContent = weekDayShort[d.getDay() + 2 - 7]; }
    else { day2Date.textContent = weekDayShort[d.getDay() + 2] }
    console.log("Two Days Ahead");   // [8-15]
    console.log("   Morning Temp: " + fiveDayReport.list[11].main.temp + "°F")
    console.log("   Afternoon Temp: " + fiveDayReport.list[12].main.temp + "°F")
    console.log("   Evening Temp: " + fiveDayReport.list[15].main.temp + "°F")
    MaxTemp(fiveDayReport, 8, 15);
    MinTemp(fiveDayReport, 8, 15);
    console.log("   Weather Description: " + fiveDayReport.list[12].weather[0].description);
    console.log("");
    console.log("");
    if((d.getDay() + 3) > 6) { day3Date.textContent = weekDayShort[d.getDay() + 3 - 7]; }
    else { day3Date.textContent = weekDayShort[d.getDay() + 3] }
    console.log("Three Days Ahead");   // [16-23]
    console.log("   Morning Temp: " + fiveDayReport.list[19].main.temp + "°F")
    console.log("   Afternoon Temp: " + fiveDayReport.list[20].main.temp + "°F")
    console.log("   Evening Temp: " + fiveDayReport.list[23].main.temp + "°F")
    MaxTemp(fiveDayReport, 16, 23);
    MinTemp(fiveDayReport, 16, 23);
    console.log("   Weather Description: " + fiveDayReport.list[20].weather[0].description);
    console.log("");
    console.log("");
    if((d.getDay() + 4) > 6) { day4Date.textContent = weekDayShort[d.getDay() + 4 - 7]; }
    else { day4Date.textContent = weekDayShort[d.getDay() + 4] }
    console.log("Four Days Ahead");   // [24-31]
    console.log("   Morning Temp: " + fiveDayReport.list[27].main.temp + "°F")
    console.log("   Afternoon Temp: " + fiveDayReport.list[28].main.temp + "°F")
    console.log("   Evening Temp: " + fiveDayReport.list[31].main.temp + "°F")
    MaxTemp(fiveDayReport, 24, 31);
    MinTemp(fiveDayReport, 24, 31);
    console.log("   Weather Description: " + fiveDayReport.list[28].weather[0].description);
    console.log("");
    console.log("");
    if((d.getDay() + 5) > 6) { day5Date.textContent = weekDayShort[d.getDay() + 5 - 7]; }
    else { day5Date.textContent = weekDayShort[d.getDay() + 5] }
    console.log("Five Days Ahead");   // [32-39]
    console.log("   Morning Temp: " + fiveDayReport.list[35].main.temp + "°F")
    console.log("   Afternoon Temp: " + fiveDayReport.list[36].main.temp + "°F")
    console.log("   Evening Temp: " + fiveDayReport.list[39].main.temp + "°F")
    MaxTemp(fiveDayReport, 32, 39);
    MinTemp(fiveDayReport, 32, 39);
    console.log("   Weather Description: " + fiveDayReport.list[36].weather[0].description);
}

function MaxTemp(data, start, end){
    let max = 0;
    for(let i = start; i < end; i++){
        if(max < data.list[i].main.temp) { max = data.list[i].main.temp; }
    }
    console.log("   Max Temp is: " + max)
}

function MinTemp(data, start, end){
    let min = 1000;
    for(let i = start; i < end; i++){
        if(min > data.list[i].main.temp) { min = data.list[i].main.temp; }
    }
    console.log("   Max Temp is: " + min)
}

AsyncCityInput();