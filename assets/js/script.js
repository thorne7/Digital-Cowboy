const APIKey = "2a4d7eab71efe7b9e662e796cee38e75";

var searchButton = document.getElementById("searchButton");

var cityName = document.getElementById("cityName").value;
var city = cityName



var todayWeather = document.getElementById("todayWeather")
var TempEl = document.getElementById("Temperature")
var WindEl = document.getElementById("Wind")
var HumidityEl = document.getElementById("Humidity")


function fetchWeatherData(cityName, APIKey) {
  const APIUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${APIKey}`;
  return fetch(APIUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`API request failed with status code: ${response.status}`);
      }
    })
    .then(data => {
      if (data) {
        return {
          longitude: data.coord.lon,
          latitude: data.coord.lat,
          temperature: data.main.temp,
          windSpeed: data.wind.speed,
          humidity: data.main.humidity,
          // iconUrl: iconUrl
        };
      } else {
        throw new Error('Weather Data not found in the API response');
      }

    })
    .catch(error => {
      console.error(error);
    });

}

searchButton.onclick = async function () {
  try {
    const cityName = document.getElementById('cityName').value;
    const APIKey = "2a4d7eab71efe7b9e662e796cee38e75";
    var weatherData = await fetchWeatherData(cityName, APIKey);
    var todayDate = document.getElementById("dateTime");
    // Update / Display the time & weather data 
    
    todayDate.innerHTML = dayjs().format("DD/MM/YYYYY HH:mm:ss");
    TempEl.innerHTML = `Temperature: ${weatherData.temperature} °C`;
    WindEl.innerHTML = `Wind speed: ${weatherData.windSpeed} m/s`;
    HumidityEl.innerHTML = `Humidity: ${weatherData.humidity} %`;

  } catch (error) {
    console.error(error);
  }
  console.log(todayDate);
};

function fetchForcast() {
  const forecastResponse = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`;
  return fetch(forecastResponse)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Forcast Response request failed with status code: ${response.status}`);
      }
    })
  then(data => {
      if (data) {
        return {
          longitude: data.coord.lon,
          latitude: data.coord.lat,
          temperature: data.main.temp,
          windSpeed: data.wind.speed,
          humidity: data.main.humidity,
          iconUrl: iconUrl
        };
      } else {
        throw new Error('Weather forcast Data not found in the API response');
      }
    })
    .catch(erroe => {
      console.error(error);
    });

}



















// $('searchBtn').click(function () {
//     var cities = document.getElementById("citiesSearch").value;

//     if ('citiesSearch' === ""){
//         return 
//     }
//     console.log(cities)


// })












// function weatherForecast(cities) {
//     fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cities + '&appid=' + APIKey + '&cnt=5')
//         .then(function (resp) {
//             return resp.json()
//         })
//         .then(function (data) {
//             console.log('--->' + (JSON.stringify(data)));
//             drawWeather(data);

//         })
//         .catch(function () {
//             // catch any errors
//         });
// }

// function drawWeather(d) {
//     var celcius = Math.round(parseFloat(d.main.temp) - 273.15);
//     var fahrenheit = Math.round(((parseFloat(d.main.temp) - 273.15) * 1.8) + 32);
//     var description = d.weather[0].description;

//     document.getElementById('description').innerHTML = description;
//     document.getElementById('temp').innerHTML = fahrenheit + '&deg;';
//     document.getElementById('location').innerHTML = d.name + ' ' + d.sys.country;
// }



// //Event Listeners on button click
// document.addEventListener("DOMContentLoaded", () => {
//     // Handling button click
//     document.querySelector(".searchBtn").addEventListener("click", () => {
//         const searchedCity = document.querySelector('#citiesSearch').value;
//         console.log(searchedCity.value);
//         if (searchedCity.value) {
//             weatherForecast(searchedCity.value);
//         }
//     })
// });