import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

if (fs.existsSync) {
  dotenv.config();
} else {
  console.warn('The environment cannot be loaded. fs module not supported.');
}

interface Coordinates {
  lon: number;
  lat: number;
}

interface WeatherClouds {
  all: number;
}

interface WeatherWind {
  speed: number;
  deg: number;
}

interface WeatherMain {
  humidity: number;
  pressure: number;
  temp: number;
  temp_min: number;
  temp_max: number;
}

export interface WeatherItem {
  description: string;
  icon: string;
  id: number;
  main: string;
}

export interface WeatherResponse {
  // General data
  cod: number;
  coord: Coordinates;
  dt: number;
  name: string;

  // Weather data
  clouds: WeatherClouds;
  main: WeatherMain;
  visibility: number;
  weather: WeatherItem[];
  wind: WeatherWind;
}

interface City {
  name: string;
  coord: Coordinates;
  country: string;
}

export interface ForecastResponse {
  city: City;
  cnt: number;
  list: WeatherItem[];
}

export class Weather {
  temperature: number;
  cloudiness: number;
  main: string;
  description: string;
  weather_id: number;

  public static fromWeatherResponse(response: WeatherResponse) {
    return new this(
      response.main.temp,
      response.clouds.all,
      response.weather[0]);
  }

  constructor(temperature: number, cloudiness: number, weather: WeatherItem) {
    this.temperature = Math.round(temperature);
    if (cloudiness < 0 || cloudiness > 100) {
      throw new Error('Unvalid cloudiness.');
    }
    this.cloudiness = cloudiness;
    this.main = weather.main;
    this.description = weather.description;
    this.weather_id = weather.id;
  }

  getIcon() {
    return iconMapping[this.weather_id];
  }

}

const iconMapping = {
  // Mapping between weather code and weather icon
  // See: http://erikflowers.github.io/weather-icons/
  // See: http://openweathermap.org/weather-conditions
  200: 'wi-thunderstorm',
  201: 'wi-thunderstorm',
  202: 'wi-thunderstorm',
  210: 'wi-thunderstorm',
  211: 'wi-thunderstorm',
  212: 'wi-thunderstorm',
  221: 'wi-thunderstorm',
  230: 'wi-thunderstorm',
  231: 'wi-thunderstorm',
  232: 'wi-thunderstorm',
  300: 'wi-hail',
  301: 'wi-hail',
  302: 'wi-hail',
  310: 'wi-hail',
  311: 'wi-hail',
  312: 'wi-hail',
  313: 'wi-hail',
  314: 'wi-hail',
  321: 'wi-hail',
  500: 'wi-rain',
  501: 'wi-rain',
  502: 'wi-rain',
  503: 'wi-rain',
  504: 'wi-rain',
  511: 'wi-rain',
  521: 'wi-showers',
  522: 'wi-showers',
  531: 'wi-showers',
  701: 'wi-fog',
  711: 'wi-fog',
  721: 'wi-fog',
  731: 'wi-fog',
  741: 'wi-fog',
  751: 'wi-fog',
  761: 'wi-fog',
  762: 'wi-fog',
  771: 'wi-fog',
  781: 'wi-fog',
  800: 'wi-day-sunny',
  801: 'wi-day-sunny-overcast',
  802: 'wi-day-cloudy',
  803: 'wi-day-cloudy',
  804: 'wi-day-cloudy'
};

@Injectable()
export class WeatherService {
  city = 'Paris,fr';
  units = 'metric';
  baseUrl = 'http://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) { }

  private getUrl(path: string) {
    const params = new URLSearchParams();
    params.set('apikey', process.env.WEATHER_API_KEY);
    params.set('units', this.units);
    params.set('q', this.city);
    return this.baseUrl + path + '?' + params.toString();
  }

  getWeather() {
    return this.http.get<WeatherResponse>(this.getUrl('/weather'))
      .map(data => Weather.fromWeatherResponse(data))
      .catch(err => { return Observable.of({error: true}) });
  }

  getForecast() {
    return this.http.get<ForecastResponse>(this.getUrl('/forecast'));
  }

}
