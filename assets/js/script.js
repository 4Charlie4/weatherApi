let todayEl = document.querySelector('#today');
let saveCity = document.querySelector('#saveCity');
let fiveCast = document.querySelector('#fiveCast');
let subBtn = document.querySelector('#userBtn');


//grab from weather api
var getWeatherApi = function(event) {
    event.preventDefault();
    let weathApi = "https://api.openweathermap.org/data/2.5/onecall?lat=28.538336&lon=-81.379234&units=imperial&exclude=hourly,alerts,minutely&appid=a22fcda0659e95b539385ad289716ca4";

    fetch(weathApi)
        .then((res) => res.json())
        .then((data) => {
            displayCurrent(data);
        })
};

//grabs from API that will convert city names into long/lat for above


//displays data pulled from weather API
var displayCurrent = function(current) {
    let todayTemp = document.createElement('p');
    let todayHumid = document.createElement('p');
    let todayWinds = document.createElement('p');

    todayTemp.innerHTML = `Temp: ${current.current.temp}`;
    todayHumid.innerHTML = `Humidity: ${current.current.humidity}`;
    todayWinds.innerHTML = `Wind: ${current.current.wind_speed}`;

    todayEl.appendChild(todayTemp);
}



//displays five day cast


//saves data pulled from API

subBtn.addEventListener('click', getWeatherApi);




