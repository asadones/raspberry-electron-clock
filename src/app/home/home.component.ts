import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Weather, WeatherService } from '../providers/weather.service';


@Component({
  providers: [WeatherService],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentDateTime: number;
  currentWeatherObs: Observable<any>;
  currentWeather: any;

  constructor(private weatherService: WeatherService) {
    this.currentDateTime = Date.now();
    setInterval(() => {this.currentDateTime = Date.now()}, 1000);
    this.setWeather();
    setInterval(() => {this.setWeather()}, 60*1000);
  }

  setWeather() {
    this.currentWeatherObs = this.weatherService.getWeather();
    this.currentWeatherObs.subscribe(
      (weather: Weather) => {this.currentWeather = weather});
  }

  ngOnInit() {
  }

}
