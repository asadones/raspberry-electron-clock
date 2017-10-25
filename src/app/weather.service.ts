import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


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

}


@Injectable()
export class WeatherService {
  api_key: string;
  http: HttpClient;
  url = 'http://api.openweathermap.org/data/2.5/weather?q=Paris,fr&appid=';

  constructor(http: HttpClient) {
    this.api_key = process.env.WEATHER_API_KEY;
    this.http = HttpClient;
  }

  getWeather() {
    return this.http.get(this.url + process.env.WEATHER_API_KEY);
  }

}
