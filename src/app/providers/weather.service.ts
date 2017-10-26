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

interface WeatherCoord {
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
  dt: number;
  name: string;

  // Weather data
  clouds: WeatherClouds;
  coord: WeatherCoord;
  main: WeatherMain;
  visibility: number;
  weather: WeatherItem[];
  wind: WeatherWind;
}

export class Weather {
  temperature: number;
  cloudiness: number;
  main: string;
  description: string;

  constructor(temperature: number, cloudiness: number, weather: WeatherItem) {
    this.temperature = temperature;
    if (cloudiness < 0 || cloudiness > 100) {
      throw "Unvalid cloudiness."
    }
    this.cloudiness = cloudiness;
    this.main = weather.main;
    this.description = weather.description;
  }

  public static fromWeatherResponse(response: WeatherResponse) {
    return new this(
      response.main.temp,
      response.clouds.all,
      response.weather[0]
    );
  }

}

@Injectable()
export class WeatherService {
  city = 'Paris,fr';
  units = 'metric';
  url = 'http://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) { }

  getWeather() {
    let params = new URLSearchParams();
    params.set('apikey', process.env.WEATHER_API_KEY);
    params.set('units', this.units);
    params.set('q', this.city);
    return this.http.get<WeatherResponse>(this.url + '?' + params.toString())
      .map(data => Weather.fromWeatherResponse(data))
      .catch(err => { return Observable.of({error: true}) });
  }

}
