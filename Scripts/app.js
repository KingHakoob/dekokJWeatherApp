// GeoCoding- http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// Current Weather- https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// 5 Day Weather- https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// Api Key- 00818819683953295233609f1731072f
// &units=imperial for Fahrenheit -Thanks Drew
// &units=metric for Celsius -Thanks Drew
// &cnt=8 limits the 5 day weather to 8 responses -by default gives 8 per day / total of 40

let cityInput = document.getElementById("cityInput");
let cityInputBtn = document.getElementById("cityInputBtn");


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

    if(!fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=00818819683953295233609f1731072f")) { return console.log("Unvalid Input"); }
    else {
        const promise = await fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=00818819683953295233609f1731072f");
        const data = await promise.json();

        cityLat = data[0].lat;
        cityLon = data[0].lon;
        console.log(cityLat);
        console.log(cityLon);
        console.log("");


        console.log(data[0].name);
        AsyncGetCurrentWeather(cityLat, cityLon);
        Async5DayForcast(cityLat, cityLon);
    }
}

async function AsyncGetCurrentWeather(lat, lon){
    const promise = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=00818819683953295233609f1731072f&units=imperial");
    const data = await promise.json();
    
    currentWeather = data;
    console.log(currentWeather);
    console.log("Current Day");
    console.log("   Current Temp Is: " + currentWeather.main.temp + "°F");
    console.log("   Max Temp Today Is: " + currentWeather.main.temp_max + "°F");
    console.log("   Min Temp Today Is: " + currentWeather.main.temp_min + "°F");
    console.log("   Current Weather: " + currentWeather.weather[0].main);
}

async function Async5DayForcast(lat, lon){
    const promise = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=00818819683953295233609f1731072f&units=imperial");
    const data = await promise.json();
    
    fiveDayReport = data;
    console.log(fiveDayReport);
    console.log("");
    console.log("One Day Ahead");   // [0-7]
    console.log("   Morning Temp: " + fiveDayReport.list[3].main.temp + "°F")
    console.log("   Afternoon Temp: " + fiveDayReport.list[4].main.temp + "°F")
    console.log("   Evening Temp: " + fiveDayReport.list[7].main.temp + "°F")
    MaxTemp(fiveDayReport, 0, 7);
    MinTemp(fiveDayReport, 0, 7);
    console.log("   Weather Description: " + fiveDayReport.list[4].weather[0].description);
    console.log("");
    console.log("");
    console.log("Two Days Ahead");   // [8-15]
    console.log("   Morning Temp: " + fiveDayReport.list[11].main.temp + "°F")
    console.log("   Afternoon Temp: " + fiveDayReport.list[12].main.temp + "°F")
    console.log("   Evening Temp: " + fiveDayReport.list[15].main.temp + "°F")
    MaxTemp(fiveDayReport, 8, 15);
    MinTemp(fiveDayReport, 8, 15);
    console.log("   Weather Description: " + fiveDayReport.list[12].weather[0].description);
    console.log("");
    console.log("");
    console.log("Three Days Ahead");   // [16-23]
    console.log("   Morning Temp: " + fiveDayReport.list[19].main.temp + "°F")
    console.log("   Afternoon Temp: " + fiveDayReport.list[20].main.temp + "°F")
    console.log("   Evening Temp: " + fiveDayReport.list[23].main.temp + "°F")
    MaxTemp(fiveDayReport, 16, 23);
    MinTemp(fiveDayReport, 16, 23);
    console.log("   Weather Description: " + fiveDayReport.list[20].weather[0].description);
    console.log("");
    console.log("");
    console.log("Four Days Ahead");   // [24-31]
    console.log("   Morning Temp: " + fiveDayReport.list[27].main.temp + "°F")
    console.log("   Afternoon Temp: " + fiveDayReport.list[28].main.temp + "°F")
    console.log("   Evening Temp: " + fiveDayReport.list[31].main.temp + "°F")
    MaxTemp(fiveDayReport, 24, 31);
    MinTemp(fiveDayReport, 24, 31);
    console.log("   Weather Description: " + fiveDayReport.list[28].weather[0].description);
    console.log("");
    console.log("");
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