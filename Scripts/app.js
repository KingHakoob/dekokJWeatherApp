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

let day1Div = document.getElementById("day1Div");
let day2Div = document.getElementById("day2Div");
let day3Div = document.getElementById("day3Div");
let day4Div = document.getElementById("day4Div");
let day5Div = document.getElementById("day5Div");

let day1Date = document.getElementById("day1Date");
let day2Date = document.getElementById("day2Date");
let day3Date = document.getElementById("day3Date");
let day4Date = document.getElementById("day4Date");
let day5Date = document.getElementById("day5Date");

let day1HighLow = document.getElementById("day1HighLow");
let day2HighLow = document.getElementById("day2HighLow");
let day3HighLow = document.getElementById("day3HighLow");
let day4HighLow = document.getElementById("day4HighLow");
let day5HighLow = document.getElementById("day5HighLow");

let futureForecast = document.getElementById("futureForecast");

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
    console.log("   Morning Temp: " + fiveDayReport.list[2].main.temp + "°F")
    console.log("   Afternoon Temp: " + fiveDayReport.list[4].main.temp + "°F")
    console.log("   Evening Temp: " + fiveDayReport.list[6].main.temp + "°F")
    console.log("   Max Temp: " + MaxTemp(fiveDayReport, 0, 7) + "°F");
    console.log("   Min Temp: " + MinTemp(fiveDayReport, 0, 7) + "°F");
    day1HighLow.textContent = MaxTemp(fiveDayReport, 0, 7) + "°F | " + MinTemp(fiveDayReport, 0, 7) + "°F"
    console.log("   Weather Description: " + fiveDayReport.list[4].weather[0].description);
    console.log("");
    console.log("");

    if((d.getDay() + 2) > 6) { day2Date.textContent = weekDayShort[d.getDay() + 2 - 7]; }
    else { day2Date.textContent = weekDayShort[d.getDay() + 2] }
    console.log("Two Days Ahead");   // [8-15]
    console.log("   Morning Temp: " + fiveDayReport.list[10].main.temp + "°F")
    console.log("   Afternoon Temp: " + fiveDayReport.list[12].main.temp + "°F")
    console.log("   Evening Temp: " + fiveDayReport.list[14].main.temp + "°F")
    console.log("   Max Temp: " + MaxTemp(fiveDayReport, 8, 15) + "°F");
    console.log("   Min Temp: " + MinTemp(fiveDayReport, 8, 15) + "°F");
    day2HighLow.textContent = MaxTemp(fiveDayReport, 8, 15) + "°F | " + MinTemp(fiveDayReport, 8, 15) + "°F"
    console.log("   Weather Description: " + fiveDayReport.list[12].weather[0].description);
    console.log("");
    console.log("");

    if((d.getDay() + 3) > 6) { day3Date.textContent = weekDayShort[d.getDay() + 3 - 7]; }
    else { day3Date.textContent = weekDayShort[d.getDay() + 3] }
    console.log("Three Days Ahead");   // [16-23]
    console.log("   Morning Temp: " + fiveDayReport.list[18].main.temp + "°F")
    console.log("   Afternoon Temp: " + fiveDayReport.list[20].main.temp + "°F")
    console.log("   Evening Temp: " + fiveDayReport.list[22].main.temp + "°F")
    console.log("   Max Temp: " + MaxTemp(fiveDayReport, 16, 23) + "°F");
    console.log("   Min Temp: " + MinTemp(fiveDayReport, 16, 23) + "°F");
    day3HighLow.textContent = MaxTemp(fiveDayReport, 16, 23) + "°F | " + MinTemp(fiveDayReport, 16, 23) + "°F"
    console.log("   Weather Description: " + fiveDayReport.list[20].weather[0].description);
    console.log("");
    console.log("");

    if((d.getDay() + 4) > 6) { day4Date.textContent = weekDayShort[d.getDay() + 4 - 7]; }
    else { day4Date.textContent = weekDayShort[d.getDay() + 4] }
    console.log("Four Days Ahead");   // [24-31]
    console.log("   Morning Temp: " + fiveDayReport.list[26].main.temp + "°F")
    console.log("   Afternoon Temp: " + fiveDayReport.list[28].main.temp + "°F")
    console.log("   Evening Temp: " + fiveDayReport.list[30].main.temp + "°F")
    console.log("   Max Temp: " + MaxTemp(fiveDayReport, 24, 31) + "°F");
    console.log("   Min Temp: " + MinTemp(fiveDayReport, 24, 31) + "°F");
    day4HighLow.textContent = MaxTemp(fiveDayReport, 24, 31) + "°F | " + MinTemp(fiveDayReport, 24, 31) + "°F"
    console.log("   Weather Description: " + fiveDayReport.list[28].weather[0].description);
    console.log("");
    console.log("");

    if((d.getDay() + 5) > 6) { day5Date.textContent = weekDayShort[d.getDay() + 5 - 7]; }
    else { day5Date.textContent = weekDayShort[d.getDay() + 5] }
    console.log("Five Days Ahead");   // [32-39]
    console.log("   Morning Temp: " + fiveDayReport.list[34].main.temp + "°F")
    console.log("   Afternoon Temp: " + fiveDayReport.list[36].main.temp + "°F")
    console.log("   Evening Temp: " + fiveDayReport.list[38].main.temp + "°F")
    console.log("   Max Temp: " + MaxTemp(fiveDayReport, 32, 39) + "°F");
    console.log("   Min Temp: " + MinTemp(fiveDayReport, 32, 39) + "°F");
    day5HighLow.textContent = MaxTemp(fiveDayReport, 32, 39) + "°F | " + MinTemp(fiveDayReport, 32, 39) + "°F"
    console.log("   Weather Description: " + fiveDayReport.list[36].weather[0].description);
}

day1Div.addEventListener('click', function(){
    CreateFutureForecast(1);
})

day2Div.addEventListener('click', function(){
    CreateFutureForecast(2);
})

day3Div.addEventListener('click', function(){
    CreateFutureForecast(3);
})

day4Div.addEventListener('click', function(){
    CreateFutureForecast(4);
})

day5Div.addEventListener('click', function(){
    CreateFutureForecast(5);
})

function CreateFutureForecast(day){
    futureForecast.innerHTML = "";



    let dayOfWeek = document.createElement("h1")
    if((d.getDay() + day) > 6) { dayOfWeek.textContent = weekDayLong[d.getDay() + day - 7]; }
    else { dayOfWeek.textContent = weekDayLong[d.getDay() + day] }

    let futureDescription = document.createElement("h1")
    futureDescription.textContent = fiveDayReport.list[((day * 8) - 4)].weather[0].description;

    let futureForecastLeftCol = document.createElement("div");
    futureForecastLeftCol.className = "col-6";

    futureForecastLeftCol.appendChild(dayOfWeek);
    futureForecastLeftCol.appendChild(futureDescription);

    let morningTxt = document.createElement("p");
    morningTxt.textContent = "6am";

    let morningTemp = document.createElement("p")
    morningTemp.textContent = Math.round(fiveDayReport.list[((day * 8) - 6)].main.temp) + "°F";

    let morningDiv = document.createElement("div");
    morningDiv.className = "col-4";

    morningDiv.appendChild(morningTxt);
    morningDiv.appendChild(morningTemp);

    let afternoonTxt = document.createElement("p");
    afternoonTxt.textContent = "Noon";

    let afternoonTemp = document.createElement("p")
    afternoonTemp.textContent = Math.round(fiveDayReport.list[((day * 8) - 4)].main.temp) + "°F";

    let afternoonDiv = document.createElement("div");
    afternoonDiv.className = "col-4";

    afternoonDiv.appendChild(afternoonTxt);
    afternoonDiv.appendChild(afternoonTemp);

    let eveningTxt = document.createElement("p");
    eveningTxt.textContent = "6pm";

    let eveningTemp = document.createElement("p")
    eveningTemp.textContent = Math.round(fiveDayReport.list[((day * 8) - 2)].main.temp) + "°F";

    let eveningDiv = document.createElement("div");
    eveningDiv.className = "col-4";

    eveningDiv.appendChild(eveningTxt);
    eveningDiv.appendChild(eveningTemp);

    let futureRightRow = document.createElement("div");
    futureRightRow.className = "row";

    futureRightRow.appendChild(morningDiv);
    futureRightRow.appendChild(afternoonDiv);
    futureRightRow.appendChild(eveningDiv);

    let futureForecastRightCol = document.createElement("div");
    futureForecastRightCol.className = "col-6"; 

    futureForecastRightCol.appendChild(futureRightRow);

    let futureForecastRow = document.createElement("div");
    futureForecastRow.className = "row";

    futureForecastRow.appendChild(futureForecastLeftCol);
    futureForecastRow.appendChild(futureForecastRightCol);

    futureForecast.appendChild(futureForecastRow);
}

function MaxTemp(data, start, end){
    let max = 0;
    for(let i = start; i < end; i++){
        if(max < data.list[i].main.temp) { max = data.list[i].main.temp; }
    }
    return Math.round(max);
}

function MinTemp(data, start, end){
    let min = 1000;
    for(let i = start; i < end; i++){
        if(min > data.list[i].main.temp) { min = data.list[i].main.temp; }
    }
    return Math.round(min);
}

AsyncCityInput();