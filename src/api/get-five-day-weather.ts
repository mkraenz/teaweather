import type { WeatherData } from "../components/interfaces";
import type { OpenWeatherForecast } from "./openweathermap.interface";
import windDegreesToDirection from "./wind-degrees-by-direction";

const getFiveDayWeather = async (
  location: { latitude: number; longitude: number },
  openWeatherApiKey: string
) => {
  const url = new URL("https://api.openweathermap.org/data/2.5/forecast");
  url.searchParams.set("lat", location.latitude.toString());
  url.searchParams.set("lon", location.longitude.toString());
  url.searchParams.set("appId", openWeatherApiKey);

  const apiRes = await fetch(url.toString());
  if (!apiRes.ok) {
    // TODO handle error
  }
  const json: OpenWeatherForecast = await apiRes.json();

  const weathers: WeatherData[] = json.list.map((entry) => ({
    location: `${json.city.name}, ${json.city.country}`,
    time: new Date(entry.dt * 1000).toISOString(),
    temperature: Math.round(entry.main.temp - 273.15), // Kelvin to Celsius
    description: entry.weather[0].description,
    weatherTypeId: entry.weather[0].id,
    temperatureUnit: "°C",
    humidity: Math.round(entry.main.humidity),
    humidityUnit: "%",
    pressure: entry.main.pressure,
    pressureUnit: "hPa",
    wind: entry.wind.speed,
    windUnit: "m/s",
    windDirection: windDegreesToDirection(entry.wind.deg),
    precipitationProbabilityInPercent: Math.round(entry.pop * 100),
  }));
  return weathers;
};

export default getFiveDayWeather;
