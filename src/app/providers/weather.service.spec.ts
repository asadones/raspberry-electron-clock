import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as sinon from 'sinon';

import { Weather, WeatherResponse, WeatherService } from './weather.service';


let mockData = {
  "coord": {"lon":-0.13,"lat":51.51},
  "weather":[
    {
      "id":300,
      "main":"Drizzle",
      "description":"light intensity drizzle",
      "icon":"09d"
    }
  ],
  "base":"stations",
  "main":{
    "temp":280.32,
    "pressure":1012,
    "humidity":81,
    "temp_min":279.15,
    "temp_max":281.15
  },
  "visibility":10000,
  "wind": {
    "speed":4.1,
    "deg": 12
  },
  "clouds": {
    "all":90
  },
  "dt":1485789600,
  "sys": {
    "type":1,
    "id":5091,
    "message":0.0103,
    "country":"GB",
    "sunrise":1485762037,
    "sunset":1485794875
  },
  "id":2643743,
  "name":"London",
  "cod":200
};


describe('WeatherService', () => {
  let api_key = 'abcdef123456';
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    process.env.WEATHER_API_KEY = api_key;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(WeatherService);
  });

  afterEach(() => {
    delete process.env.WEATHER_API_KEY;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('have getWeather that return the current weather', (done) => {
    service.getWeather().subscribe(
      (result: any) => {
        expect(result.main.temp).toEqual(mockData.main.temp);
        expect(result.clouds.all).toEqual(mockData.clouds.all);
        expect(result.name).toEqual(mockData.name);
        done();
      });
      let request = httpMock.expectOne(
        'http://api.openweathermap.org/data/2.5/weather?'
        + 'apikey=abcdef123456&'
        + 'units=metric&'
        + 'q=Paris,fr');
      request.flush(mockData);
      httpMock.verify();
  });

});

describe('Weather', () => {
  let weather;

  beforeEach(() => {
    weather = new Weather(18, 57);
  });

  it('should be created', () => {
    expect(weather).toBeTruthy();
    expect(weather.temperature).toEqual(18);
    expect(weather.cloudiness).toEqual(57);
  });

  it('should not accept values < 0 or > 100 for cloudiness', () => {
    expect(() => {new Weather(5, -4)}).toThrow('Unvalid cloudiness.');
    expect(() => {new Weather(5, 110)}).toThrow('Unvalid cloudiness.');
  });

  it('is created properly from WeatherResponse', () => {
    let weather = Weather.fromWeatherResponse(<WeatherResponse>mockData);
    expect(weather.temperature).toEqual(mockData.main.temp);
    expect(weather.cloudiness).toEqual(mockData.clouds.all);
  });

});
