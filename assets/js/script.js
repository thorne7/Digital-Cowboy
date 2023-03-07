const forecastAPIKey = "2a4d7eab71efe7b9e662e796cee38e75";
const weatherAPIKey = "7ad3b0f6c53c6a536bcfca757bc87004";
const searchButton = document.getElementById("searchButton");
const cityNameInput = document.getElementById("cityName");
const todayWeather = document.getElementById("todayWeather");
const tempEl = document.getElementById("Temperature");
const windEl = document.getElementById("Wind");
const humidityEl = document.getElementById("Humidity");
const forecastList = document.getElementById("forecastList");
const cityElName = document.getElementById("city");
const previousCities = JSON.parse(localStorage.getItem("previousCities")) || [];

function fetchWeatherData(cityName, weatherAPIKey) {
  const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${weatherAPIKey}`;
  return fetch(APIUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`API request failed with status code: ${response.status}`);
      }
    })
    .then(data => {
      return {
        longitude: data.coord.lon,
        latitude: data.coord.lat,
        temperature: data.main.temp,
        windSpeed: data.wind.speed,
        humidity: data.main.humidity,
      };
    });
}

function fetchForecastData(latitude, longitude, forecastAPIKey) {
  const APIUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${forecastAPIKey}&cnt=5`;
  return fetch(APIUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`API request failed with status code: ${response.status}`);
      }
    })
    .then(data => {
      return data.list;
    });
}


function updateWeatherUI(weatherData, forecastData) {
  tempEl.innerHTML = `Temperature: ${weatherData.temperature} °C`;
  windEl.innerHTML = `Wind speed: ${weatherData.windSpeed} m/s`;
  humidityEl.innerHTML = `Humidity: ${weatherData.humidity} %`;
  updateForecastUI(forecastData);
}

function updateForecastUI(forecastData) {
  forecastList.innerHTML = '';
  const today = new Date();
  let nextFiveDays = [];
  for (let i = 1; i <= 5; i++) {
    const nextDay = dayjs(today).add(i, 'day');
    nextFiveDays.push(nextDay.format('YYYY-MM-DD'));
  }

  const filteredForecastData = forecastData.filter(forecast => {
    const [date, time] = forecast.dt_txt.split(' ');
    const [hour] = time.split(':');
    return nextFiveDays.includes(date) && hour === '12';
  });

  // group the forecasts by day
  const groupedForecastData = {};
  filteredForecastData.forEach(forecast => {
    const forecastDay = dayjs(forecast.dt_txt).format('dddd');
    if (!groupedForecastData[forecastDay]) {
      groupedForecastData[forecastDay] = [];
    }
    groupedForecastData[forecastDay].push(forecast);
  });

  // create a forecast item for each day
  Object.entries(groupedForecastData).forEach(([day, forecasts]) => {
    const dayEl = document.createElement('div');
    dayEl.classList.add('forecast-day');
    dayEl.innerHTML = `<h3>${day}</h3>`;
    forecastList.appendChild(dayEl);

    forecasts.forEach(forecast => {
      const forecastDate = dayjs(forecast.dt_txt).format('HH:mm');
      const forecastTemp = forecast.main.temp;
      const forecastIconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
      const forecastWindSpeed = forecast.wind.speed;
      const forecastHumidity = forecast.main.humidity;

      const forecastEl = document.createElement('div');
      forecastEl.classList.add('forecast-item');
      forecastEl.innerHTML = `
        <div class="forecast-time">${forecastDate}</div>
        <div class="forecast-info">
          <img src="${forecastIconUrl}" class="forecast-icon"/>
          <div class="forecast-temp">${forecastTemp} °C</div>
          <div class="forecast-wind-speed">${forecastWindSpeed} m/s</div>
          <div class="forecast-humidity">${forecastHumidity} %</div>
        </div>
      `;
      dayEl.appendChild(forecastEl);
    });
  });
  console.log(forecastData);
}


function saveCityToLocalStorage(cityName) {
  // Check if the city name already exists in the array
  if (!previousCities.includes(cityName)) {
    // Add the city name to the beginning of the array
    previousCities.unshift(cityName);

    // Save the updated array to local storage
    localStorage.setItem("previousCities", JSON.stringify(previousCities));

    // Create a button for the new city and add it to the UI

    const buttonEl = document.createElement("button");
    buttonEl.classList.add("btn-primary");
    buttonEl.innerHTML = cityName;
    buttonEl.addEventListener("click", () => {
      // When a previous city button is clicked, fetch the weather and forecast data for that city
      document.getElementById("cityName").value = cityName;
      searchButton.click();
    });
  }
}

function updateCityButtonsSection() {

  const previousCitiesList = document.querySelector("#previousCities");
  previousCitiesList.innerHTML = "";
  for (let i = 0; i < previousCities.length; i++) {
    const city = previousCities[i];
    const cityButton = document.createElement("button");
    cityButton.textContent = city;

    cityButton.classList.add("btn", "btn-primary", "mx-1", "mb-2");
    cityButton.addEventListener("click", () => {
      fetchWeatherData(city, weatherAPIKey)
        .then(weatherData => {
          fetchForecastData(weatherData.latitude, weatherData.longitude, forecastAPIKey)
            .then(forecastData => updateWeatherUI(weatherData, forecastData))
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    });
    previousCitiesList.appendChild(cityButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "&times;";
    deleteButton.classList.add("btn", "btn-danger", "mx-1", "mb-2");
    deleteButton.addEventListener("click", () => {
      previousCities.splice(i, 1);
      localStorage.setItem("previousCities", JSON.stringify(previousCities));
      updateCityButtonsSection();
    });
    previousCitiesList.appendChild(deleteButton);
  }
}

searchButton.addEventListener("click", async () => {
  try {
    const cityName = cityNameInput.value;
    const weatherData = await fetchWeatherData(cityName, weatherAPIKey);
    const forecastData = await fetchForecastData(weatherData.latitude, weatherData.longitude, forecastAPIKey);
    updateWeatherUI(weatherData, forecastData);
    saveCityToLocalStorage(cityName);
    updateCityButtonsSection();
  } catch (error) {
    console.log(error);
  }
});

updateCityButtonsSection();