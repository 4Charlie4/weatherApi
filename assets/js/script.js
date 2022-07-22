const todayEl = document.querySelector("#today");
const saveCity = document.querySelector("#saveCity");
const fiveCast = document.querySelector("#fiveCast");
const subBtn = document.querySelector("#userBtn");
let userInput = document.querySelector("#userInp");
let city = "";
let cityArry = [];
let clearHistory = document.querySelector("#clearHistory");
//current day
const todayTemp = document.querySelector("#currentTemp");
const todayHumid = document.querySelector("#currentHumid");
const todayWinds = document.querySelector("#currentWind");
const todayIcon = document.querySelector("#currentIcon");
const todayIndex = document.querySelector("#currentIndex");
const todayName = document.querySelector("#cityName");

//five day forecast
const fiveDay = document.querySelector("#fiveCast");
const future = document.querySelectorAll(".future");
const fiveDate = document.querySelectorAll(".dateF");
console.log(future);

var searchArray = function (city) {
  for (var i = 0; i < cityArry.length; i++) {
    if (city.toUpperCase() === cityArry[i]) {
      return -1;
    }
  }
  return 1;
};

var formatCityName = function (event) {
  event.preventDefault();
  if (userInput.value !== "") {
    city = userInput.value.split(" ").join("");
    convertInputApi(city);
  } else {
    alert("Please Type in a City Name");
  }
};

//grab from weather api
var getWeatherApi = function (lat, lon) {
  //console.log(lat, lon);
  const weathApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,alerts,minutely&appid=a22fcda0659e95b539385ad289716ca4`;

  fetch(weathApi)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayCurrent(data);
      displayFuture(data.daily);
    });
};

//grabs from API that will convert city names into long/lat for above
var convertInputApi = function (city) {
  var convertApi =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=a22fcda0659e95b539385ad289716ca4";
  fetch(convertApi).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        const geoData = data[0];
        const lat = geoData.lat;
        const lon = geoData.lon;
        saveCityName(city);
        getWeatherApi(lat, lon);
      });
    } else {
      alert("Error: Not a valid City");
    }
  });
};

//displays data pulled from weather API for current day
var displayCurrent = function (current) {
  let currentWeather = current.current;
  let currentDate = new Date(currentWeather.dt * 1000).toLocaleDateString();

  todayName.innerHTML = `${city}:`.toUpperCase() + ` ${currentDate}`;
  todayTemp.innerHTML = ` ${currentWeather.temp}`;
  todayHumid.innerHTML = ` ${currentWeather.humidity} %`;
  todayWinds.innerHTML = ` ${currentWeather.wind_speed} MPH`;
  todayIndex.innerHTML = ` ${currentWeather.uvi}`;

  //need image to appear instead
  let currentIcon = `${currentWeather.weather[0].icon}`;
  let iconUrl = `http://openweathermap.org/img/wn/${currentIcon}@2x.png`;
  todayIcon.innerHTML = "<img src=" + iconUrl + ">";
};

//displays five day cast
var displayFuture = function (five) {
  for (var i = 0; i < 5; i++) {
    //converts UTC into current date
    let dailyDate = new Date(five[i].dt * 1000).toLocaleDateString();
    console.log(dailyDate);
    let tempFive = five[i].temp.day;
    //Weather icon implementation
    let dailyIcon = `${five[i].weather[0].icon}`;
    let dailyIconUrl = `http://openweathermap.org/img/wn/${dailyIcon}@2x.png`;

    //places temp, wind and humidity, in their respective places
    document.querySelector(`#ftemp${[i]}`).innerHTML = " " + tempFive;
    document.querySelector(`#fwind${[i]}`).innerHTML =
      " " + five[i].wind_speed + " MPH";
    document.querySelector(`#fhumid${[i]}`).innerHTML =
      " " + five[i].humidity + "%";
    document.querySelector(`#fimage${[i]}`).innerHTML =
      "<img src=" + dailyIconUrl + ">";
    document.querySelector(`#fdate${[i]}`).innerHTML = dailyDate;
  }
};

var saveCityName = function (city) {
  cityArry = JSON.parse(localStorage.getItem("city"));
  if (cityArry == null) {
    cityArry = [];
    cityArry.push(city.toUpperCase());
    localStorage.setItem("city", JSON.stringify(cityArry));
    appendToList(city.toUpperCase());
  } else {
    if (searchArray(city) > 0) {
      cityArry.push(city.toUpperCase());
      localStorage.setItem("city", JSON.stringify(cityArry));
      appendToList(city.toUpperCase());
    }
  }
  userInput.value = "";
};

var appendToList = function (city, listItem) {
  var listItem = document.createElement("li");
  listItem.setAttribute("class", "list-group-item");
  listItem.setAttribute("data-value", city);
  listItem.innerHTML = city;
  document.querySelector(".list-group").appendChild(listItem);
};

var loadCityName = function (listCity) {
  document.querySelector(".list-group").innerHTML = "";
  cityArry = JSON.parse(localStorage.getItem("city"));
  if (cityArry !== null) {
    cityArry = JSON.parse(localStorage.getItem("city"));
    for (i = 0; i < cityArry.length; i++) {
      appendToList(cityArry[i]);
    }
    city = cityArry[i - 1];
    convertInputApi(city);
  }
};

var loadCityClick = function (event) {
  let savedList = event.target.innerHTML;
  if (event.target.matches("li")) {
    city = savedList;
    console.log(city);
    console.log(event.target);
    convertInputApi(city);
  }
};

//saves data pulled from API

subBtn.addEventListener("click", formatCityName);
document.addEventListener("click", loadCityClick);
window.addEventListener("load", loadCityName);
clearHistory.addEventListener("click", function (event) {
  event.preventDefault();
  cityArry = [];
  localStorage.removeItem("city");
  document.location.reload();
});
