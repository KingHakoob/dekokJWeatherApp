// GeoCoding- http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// Current Weather- https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// 5 Day Weather- https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// &units=imperial for Fahrenheit -Thanks Drew
// &units=metric for Celsius -Thanks Drew
// &cnt=8 limits the 5 day weather to 8 responses -by default gives 8 per day / total of 40

import { apiKey } from './environment.js';
import { SaveToLocalStorageByName, GetLocalStorage, RemoveFromLocalStorage } from './localStorage.js';

let cityInput = document.getElementById("cityInput");
let cityInputBtn = document.getElementById("cityInputBtn");

let cityName = document.getElementById("cityName");
let day0Temp = document.getElementById("day0Temp");
let day0Description = document.getElementById("day0Description");
let day0HighLow = document.getElementById("day0HighLow");

let addFavBtn = document.getElementById("addFavBtn");

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

let openFavoritesBtn = document.getElementById("openFavoritesBtn");
let favoritesOffCanvas = document.getElementById("favoritesOffCanvas");
let closeFavoritesBtn = document.getElementById("closeFavoritesBtn");
let favCitiesBody = document.getElementById("favCitiesBody");

let changeTemp = document.getElementById("tempChangeTxt");

let changeModeBtn = document.getElementById("modeChange");
let bodyTag = document.getElementById("bodyTag");

let currentLat;
let currentLon;
let city;
let cityLat;
let cityLon;
let currentWeather;
let fiveDayReport;

let tempView = '°F';

let modeTxt = 'DM';
let modeIconTxt = './Assets/Icons/iconizer-sun.svg'


changeModeBtn.addEventListener('click', function(){
    if(modeTxt === 'DM') {
        modeTxt = 'NM';
        bodyTag.className = "bodyNM";
        
        let txtColor = document.getElementsByClassName('modeColorTxt');
        for(let i = 0; i < txtColor.length; i++) {
            txtColor[i].style.color = 'white';
        }

        let solidBackgroundColor = document.getElementsByClassName('modeBackgroundColorSolid');
        for(let i = 0; i < solidBackgroundColor.length; i++) {
            solidBackgroundColor[i].style.backgroundColor = '#2F2F2F';
        }

        let transparentBackgroundColor = document.getElementsByClassName('modeBackgroundColorTransparent');
        for(let i = 0; i < transparentBackgroundColor.length; i++) {
            transparentBackgroundColor[i].style.backgroundColor = '#3A373Dc4';
        }

        let forecastIcons = document.getElementsByClassName('forecastIcons');
        for(let i = 0; i < forecastIcons.length; i++) {
            forecastIcons[i].src = './Assets/Icons/iconizer-cloud-hail-sun(1).svg';
        }

    }else {
        modeTxt = 'DM';
        bodyTag.className = "bodyDM";

        let txtColor = document.getElementsByClassName('modeColorTxt');
        for(let i = 0; i < txtColor.length; i++) {
            txtColor[i].style.color = '#454545';
        } 

        let solidBackgroundColor = document.getElementsByClassName('modeBackgroundColorSolid');
        for(let i = 0; i < solidBackgroundColor.length; i++) {
            solidBackgroundColor[i].style.backgroundColor = 'white';
        }

        let transparentBackgroundColor = document.getElementsByClassName('modeBackgroundColorTransparent');
        for(let i = 0; i < transparentBackgroundColor.length; i++) {
            transparentBackgroundColor[i].style.backgroundColor = '#ffffffc4';
        }

        let forecastIcons = document.getElementsByClassName('forecastIcons');
        for(let i = 0; i < forecastIcons.length; i++) {
            forecastIcons[i].src = './Assets/Icons/cloud-hail-sun.svg';
        }
    }
})


const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximunAge: 0
}

function success(position){
    currentLat = position.coords.latitude;
    currentLon = position.coords.longitude;

    AsyncGetCurrentWeather(currentLat, currentLon);
    Async5DayForcast(currentLat, currentLon);
}

function error(err){
    console.warn(err.message);
}

navigator.geolocation.getCurrentPosition(success, error, options);

cityInputBtn.addEventListener('click', function(){
    city = cityInput.value;
    AsyncCityInput();
})

async function AsyncCityInput(){

    if(!fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey)) { return console.log("Invalid Input"); }
    else {
        const promise = await fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey);
        const data = await promise.json();

        cityLat = data[0].lat;
        cityLon = data[0].lon;

        AsyncGetCurrentWeather(cityLat, cityLon);
        Async5DayForcast(cityLat, cityLon);
    }
}

async function AsyncGetCurrentWeather(lat, lon){
    let promise;
    let data;

    if(tempView === '°F') {
        promise = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial");
        data = await promise.json();
    }else {
        promise = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=metric");
        data = await promise.json();
    }

    currentWeather = data;

    cityName.textContent = currentWeather.name;
    city = cityName.textContent + ", " + currentWeather.sys.country;
    day0Temp.textContent = Math.round(currentWeather.main.temp) + tempView;

    day0Description.textContent = currentWeather.weather[0].main;

    day0HighLow.textContent = "H:" + Math.round(currentWeather.main.temp_max) + tempView +" L:" + Math.round(currentWeather.main.temp_min) + tempView;
}

async function Async5DayForcast(lat, lon){
    let promise;
    let data;

    if(tempView === '°F') {
        promise = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial");
        data = await promise.json();
    }else {
        promise = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=metric");
        data = await promise.json();
    }
    
    fiveDayReport = data;

    if((d.getDay() + 1) > 6) { day1Date.textContent = weekDayShort[d.getDay() + 1 - 7]; }
    else { day1Date.textContent = weekDayShort[d.getDay() + 1] }
    day1HighLow.textContent = MaxTemp(fiveDayReport, 0, 7) + tempView + " | " + MinTemp(fiveDayReport, 0, 7) + tempView;

    if((d.getDay() + 2) > 6) { day2Date.textContent = weekDayShort[d.getDay() + 2 - 7]; }
    else { day2Date.textContent = weekDayShort[d.getDay() + 2] }
    day2HighLow.textContent = MaxTemp(fiveDayReport, 8, 15) + tempView + " | " + MinTemp(fiveDayReport, 8, 15) + tempView;

    if((d.getDay() + 3) > 6) { day3Date.textContent = weekDayShort[d.getDay() + 3 - 7]; }
    else { day3Date.textContent = weekDayShort[d.getDay() + 3] }
    day3HighLow.textContent = MaxTemp(fiveDayReport, 16, 23) + tempView + " | " + MinTemp(fiveDayReport, 16, 23) + tempView;

    if((d.getDay() + 4) > 6) { day4Date.textContent = weekDayShort[d.getDay() + 4 - 7]; }
    else { day4Date.textContent = weekDayShort[d.getDay() + 4] }
    day4HighLow.textContent = MaxTemp(fiveDayReport, 24, 31) + tempView + " | " + MinTemp(fiveDayReport, 24, 31) + tempView;

    if((d.getDay() + 5) > 6) { day5Date.textContent = weekDayShort[d.getDay() + 5 - 7]; }
    else { day5Date.textContent = weekDayShort[d.getDay() + 5] }
    day5HighLow.textContent = MaxTemp(fiveDayReport, 32, 39) + tempView + " | " + MinTemp(fiveDayReport, 32, 39) + tempView;
}

addFavBtn.addEventListener('click', function(){
    SaveToLocalStorageByName(city);
})

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

openFavoritesBtn.addEventListener('click', function(){
    favoritesOffCanvas.classList.add("show");
    favCitiesBody.innerHTML = "";
    
    let favorites = GetLocalStorage();

    favorites.map(cityName => {
        DisplayFavorties(cityName);
    })
})

closeFavoritesBtn.addEventListener('click', function(){
    favoritesOffCanvas.classList.remove("show");
})

function CreateFutureForecast(day){
    futureForecast.innerHTML = "";



    let dayOfWeek = document.createElement("h1")
    dayOfWeek.className = "futureForecastDay";
    if((d.getDay() + day) > 6) { dayOfWeek.textContent = weekDayLong[d.getDay() + day - 7]; }
    else { dayOfWeek.textContent = weekDayLong[d.getDay() + day] }

    let futureDescription = document.createElement("h1")
    futureDescription.className = "futureForecastDescription";
    futureDescription.textContent = fiveDayReport.list[((day * 8) - 4)].weather[0].description;

    let futureForecastLeftCol = document.createElement("div");
    futureForecastLeftCol.className = "col-6";

    futureForecastLeftCol.appendChild(dayOfWeek);
    futureForecastLeftCol.appendChild(futureDescription);

    let morningTxt = document.createElement("p");
    morningTxt.className = "futureForecastTimeTxt";
    morningTxt.textContent = "6am";

    let morningIcon = document.createElement("img");
    morningIcon.className = "futureForecastIcons";
    morningIcon.src = "./Assets/Icons/iconizer-sun.svg";
    morningIcon.alt = "Morning Icon";

    let morningTemp = document.createElement("p")
    morningTemp.className = "futureForecastTempTxt";
    morningTemp.textContent = Math.round(fiveDayReport.list[((day * 8) - 6)].main.temp) + "°";

    let morningDiv = document.createElement("div");
    morningDiv.className = "col-4 futureForecastRightDivs";

    morningDiv.appendChild(morningTxt);
    morningDiv.appendChild(morningIcon);
    morningDiv.appendChild(morningTemp);

    let afternoonTxt = document.createElement("p");
    afternoonTxt.className = "futureForecastTimeTxt";
    afternoonTxt.textContent = "noon";

    let afternoonIcon = document.createElement("img");
    afternoonIcon.className = "futureForecastIcons";
    afternoonIcon.src = "./Assets/Icons/iconizer-cloud-sun.svg";
    afternoonIcon.alt = "Afternoon Icon";

    let afternoonTemp = document.createElement("p")
    afternoonTemp.className = "futureForecastTempTxt";
    afternoonTemp.textContent = Math.round(fiveDayReport.list[((day * 8) - 4)].main.temp) + "°";

    let afternoonDiv = document.createElement("div");
    afternoonDiv.className = "col-4 futureForecastRightDivs futureForecastMiddleDiv";

    afternoonDiv.appendChild(afternoonTxt);
    afternoonDiv.appendChild(afternoonIcon);
    afternoonDiv.appendChild(afternoonTemp);

    let eveningTxt = document.createElement("p");
    eveningTxt.className = "futureForecastTimeTxt";
    eveningTxt.textContent = "6pm";

    let eveningIcon = document.createElement("img");
    eveningIcon.className = "futureForecastIcons";
    eveningIcon.src = "./Assets/Icons/iconizer-moon-75.svg";
    eveningIcon.alt = "Evening Icon";

    let eveningTemp = document.createElement("p")
    eveningTemp.className = "futureForecastTempTxt";
    eveningTemp.textContent = Math.round(fiveDayReport.list[((day * 8) - 2)].main.temp) + "°";

    let eveningDiv = document.createElement("div");
    eveningDiv.className = "col-4 futureForecastRightDivs";

    eveningDiv.appendChild(eveningTxt);
    eveningDiv.appendChild(eveningIcon);
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

function DisplayFavorties(cityName){
    let favCityName = document.createElement("p");
    favCityName.className = "favCityName modeColorTxt";
    favCityName.textContent = cityName;

    let removeFavBtn = document.createElement("button");
    removeFavBtn.className = "btn-close removeFavBtn";
    removeFavBtn.type = "button";
    removeFavBtn.addEventListener('click', function(){
        RemoveFromLocalStorage(cityName);
        favCitiesBody.innerHTML = "";
        let favorites = GetLocalStorage();
        favorites.map(cityName => {
            DisplayFavorties(cityName);
        })
    })

    let favBodyDiv = document.createElement("div");
    favBodyDiv.className = "favBody modeBackgroundColorSolid";

    favBodyDiv.appendChild(favCityName);
    favBodyDiv.appendChild(removeFavBtn);

    let favSpacingDiv = document.createElement("div");
    favSpacingDiv.className = "favSpacing";

    favSpacingDiv.appendChild(favBodyDiv);
    favCitiesBody.appendChild(favSpacingDiv);
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

changeTemp.addEventListener('click', function(){
    ChangeTempView();
})

async function ChangeTempView(){
    if(tempView === '°F') {
        tempView = '°C';
        changeTemp.textContent = "temperature view: Celsius (click to change)"
    }else {
        tempView = '°F';
        changeTemp.textContent = "temperature view: Fahrenheit (click to change)"
    }

    const promise = await fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey);
    const data = await promise.json();

    cityLat = data[0].lat;
    cityLon = data[0].lon;

    AsyncGetCurrentWeather(cityLat, cityLon);
    Async5DayForcast(cityLat, cityLon);
}
