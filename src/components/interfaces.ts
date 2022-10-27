export interface WeatherData {
  location: string;
  time: string;
  description: string;
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
