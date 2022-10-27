export interface WeatherData {
  location: string;
  time: string;
  description: string;
  weatherTypeId: number; // IDs as in https://openweathermap.org/weather-conditions
  temperature: number;
  temperatureUnit: string;
  humidity: number;
  humidityUnit: string;
  pressure: number;
  pressureUnit: string;
  wind: number;
  windUnit: string;
  windDirection: string;
  precipitationProbabilityInPercent: number;
}
