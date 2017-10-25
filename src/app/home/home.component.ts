import { Component, OnInit } from '@angular/core';

import { Weather, WeatherResponse, WeatherService } from '../providers/weather.service';


@Component({
  providers: [WeatherService],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentDateTime: number;
  currentWeather: any;

  constructor(private weatherService: WeatherService) {
    this.currentDateTime = Date.now();
    setInterval(() => {this.currentDateTime = Date.now()}, 1000);
    this.setWeather();
    setInterval(() => {this.setWeather()}, 60*60*1000);
  }

  setWeather() {
    this.weatherService.getWeather()
      .subscribe((response: WeatherResponse) => {
        this.currentWeather = Weather.fromWeatherResponse(response);
      });
  }

  ngOnInit() {
  }

}
