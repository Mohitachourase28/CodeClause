class WeatherApp {
  constructor() {
    this.API_KEY = "31edc025a4da4393ac144443251809"; 
    this.BASE_URL = "http://api.weatherapi.com/v1/current.json"; 
    this.initEventListeners();
    this.loadDefaultCity();
  }

  initEventListeners() {
    const searchBtn = document.getElementById("searchBtn");
    const cityInput = document.getElementById("cityInput");

    searchBtn.addEventListener("click", () => this.searchWeather());
    cityInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.searchWeather();
      }
    });
  }

  async searchWeather() {
    const city = document.getElementById("cityInput").value.trim();

    if (!city) {
      this.showError("Please enter a city name");
      return;
    }

    this.showLoading();

    try {
      const weatherData = await this.fetchWeatherData(city);
      this.displayWeather(weatherData);
    } catch (error) {
      this.showError("City not found. Please try another city.");
    }
  }

  async fetchWeatherData(city) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sampleData = this.getSampleWeatherData(city);
        if (sampleData) {
          resolve(sampleData);
        } else {
          reject(new Error("City not found"));
        }
      }, 1000); 
    });

  }

  getSampleWeatherData(city) {
    const sampleCities = {
      london: {
        name: "London",
        main: { temp: 15, feels_like: 13, humidity: 72, pressure: 1013 },
        weather: [
          { main: "Clouds", description: "overcast clouds", icon: "04d" },
        ],
        wind: { speed: 3.6 },
      },
      "new york": {
        name: "New York",
        main: { temp: 22, feels_like: 24, humidity: 65, pressure: 1015 },
        weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
        wind: { speed: 2.1 },
      },
      tokyo: {
        name: "Tokyo",
        main: { temp: 28, feels_like: 32, humidity: 78, pressure: 1008 },
        weather: [{ main: "Rain", description: "light rain", icon: "10d" }],
        wind: { speed: 1.5 },
      },
      paris: {
        name: "Paris",
        main: { temp: 18, feels_like: 16, humidity: 68, pressure: 1012 },
        weather: [{ main: "Clear", description: "few clouds", icon: "02d" }],
        wind: { speed: 2.8 },
      },
      sydney: {
        name: "Sydney",
        main: { temp: 25, feels_like: 27, humidity: 60, pressure: 1016 },
        weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
        wind: { speed: 4.2 },
      },
    };

    return sampleCities[city.toLowerCase()] || null;
  }

  displayWeather(data) {
    this.hideLoading();
    this.hideError();

    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temperature").textContent = `${Math.round(
      data.main.temp
    )}°C`;
    document.getElementById("description").textContent =
      data.weather[0].description;
    document.getElementById("feelsLike").textContent = `${Math.round(
      data.main.feels_like
    )}°C`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("windSpeed").textContent = `${data.wind.speed} m/s`;
    document.getElementById(
      "pressure"
    ).textContent = `${data.main.pressure} hPa`;

    document.getElementById("weatherIcon").textContent = this.getWeatherIcon(
      data.weather[0].main
    );

    document.getElementById("weatherInfo").style.display = "block";
  }

  getWeatherIcon(weatherMain) {
    const icons = {
      Clear: "☀️",
      Clouds: "☁️",
      Rain: "🌧️",
      Drizzle: "🌦️",
      Thunderstorm: "⛈️",
      Snow: "❄️",
      Mist: "🌫️",
      Smoke: "🌫️",
      Haze: "🌫️",
      Dust: "🌫️",
      Fog: "🌫️",
      Sand: "🌫️",
      Ash: "🌫️",
      Squall: "💨",
      Tornado: "🌪️",
    };
    return icons[weatherMain] || "🌤️";
  }

  showLoading() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("weatherInfo").style.display = "none";
    this.hideError();
  }

  hideLoading() {
    document.getElementById("loading").style.display = "none";
  }

  showError(message) {
    document.getElementById("error").textContent = message;
    document.getElementById("error").style.display = "block";
    document.getElementById("weatherInfo").style.display = "none";
    this.hideLoading();
  }

  hideError() {
    document.getElementById("error").style.display = "none";
  }

  loadDefaultCity() {
    document.getElementById("cityInput").value = "London";
    this.searchWeather();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new WeatherApp();
});
