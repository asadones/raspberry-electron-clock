import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


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
  url = 'http://api.openweathermap.org/data/2.5/weather?q=Paris,fr&appid=';

  constructor(private http: HttpClient) { }

  getWeather() {
    return this.http.get<WeatherResponse>(this.url + process.env.WEATHER_API_KEY)
  }

}
