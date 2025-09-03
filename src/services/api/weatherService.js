import weatherData from "@/services/mockData/weather.json";

class WeatherService {
  constructor() {
    this.weather = [...weatherData];
    this.delay = 250;
  }

  async getCurrentWeather() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    return [...this.weather.slice(0, 5)];
  }

  async getExtendedForecast() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    return [...this.weather];
  }
}

export default new WeatherService();