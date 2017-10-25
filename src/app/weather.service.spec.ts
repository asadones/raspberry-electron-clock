import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as sinon from 'sinon';

import { Weather, WeatherService } from './weather.service';

describe('WeatherService', () => {
  let api_key = 'abcdef123456';
  let service: WeatherService;
  let httpMock: HttpTestingController;
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
      "temp_max":281.15},
      "visibility":10000,
      "wind": {"speed":4.1,"deg":80},
      "clouds": {"all":90},
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
  }));

  it('should load the api key', () => {
    expect(service.api_key).toEqual('abcdef123456');
  }));

  it('have getWeather that return the current weather', (done) => {
    service.getWeather().subscribe(
      (result: Weather) => {
        expect(result.temperature).toEqual(this.mockData.main.temp);
        done();
      });
      let request = httpMock.expectOne(
        'http://api.openweathermap.org/data/2.5/weather?q=Paris,fr&appid=abcdef123456');
      request.flush(this.mockData);
      httpMock.verify();
  }));

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

});
