var APIKey = "2a4d7eab71efe7b9e662e796cee38e75";
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
var cityName = document.getElementById("cityName").value;
var searchButton = document.getElementById("searchButton");

var lon = []
var lat = []




function fetchCoordinates(cityName, APIKey) {
    const APIUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`;
    return fetch(APIUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`API request failed with status code: ${response.status}`);
        }
      })
      .then(data => {
        if (data.coord) {
          return {
            longitude: data.coord.lon,
            latitude: data.coord.lat
            temperature: data.main.temp,
            windSpeed: data.wind.speed,
            humidity: data.main.humidity
          };
        } else {
          throw new Error('Coordinates not found in the API response');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  searchButton.onclick = function() {
    const cityName = document.getElementById('cityName').value;
    const APIKey = "2a4d7eab71efe7b9e662e796cee38e75";
  
    fetchCoordinates(cityName, APIKey)
      .then(coordinates => {
        console.log(coordinates);
      });
  };







// $("#searchBtn").click (function () {
//         console.log("click");


//         var searchCity = $("citiesSearch").val();
//         console.log(searchCity);
//         if (searchCity === "") {
//             return;
//         }})




// function getCitiesCoordinates(lon, lat) {

// }



// fetch(queryURL)
// .then(function (response) {

//     return response.json()

// })

// .then(function (data) {
//     console.table(JSON.stringify(data));

// })
// )













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