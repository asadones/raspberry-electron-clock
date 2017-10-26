import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import * as env from 'node-env-file';
import * as fs from 'fs';

if (fs.existsSync) {
  env(__dirname + '/.env');
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

interface WeatherMain {
  humidity: number;
  pressure: number;
  temp: number;
  temp_min: number;
  temp_max: number;
}

export interface WeatherResponse {
  clouds: WeatherClouds;
  coord: WeatherCoord;
  main: WeatherMain;
  name: string;
}

export class Weather {
  temperature: number;
  cloudiness: number;

  constructor(temperature: number, cloudiness: number) {
    this.temperature = temperature;
    if (cloudiness < 0 || cloudiness > 100) {
      throw "Unvalid cloudiness."
    }
    this.cloudiness = cloudiness;
  }

  public static fromWeatherResponse(response: WeatherResponse) {
    return new this(
      response.main.temp,
      response.clouds.all
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
    return this.http.get<WeatherResponse>(this.url + '?' + params.toString());
  }

}
