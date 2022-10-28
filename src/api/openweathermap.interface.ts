/** Api response interface derived from 
GET https://api.openweathermap.org/data/2.5/forecast?lat=51.5072&lon=-0.11&appid={{openweatherapikey}} */
export interface OpenWeatherForecast {
  cod: string;
  message: number;
  cnt: number;
  list: List[];
  city: City;
}

interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

interface Coord {
  lat: number;
  lon: number;
}

interface List {
  dt: number;
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: Rain;
  sys: Sys;
  dt_txt: string;
}

interface Sys {
  pod: string;
}

interface Rain {
  "3h": number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface Clouds {
  all: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface OpenWeatherLocation {
  name: string;
  local_names: Localnames;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

type CountryCode = string; // examples: en, de, ru, mi, na, zh, ja
type Localnames = Record<CountryCode, string>;
