import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as sinon from 'sinon';

import { Weather, WeatherItem, WeatherResponse, WeatherService } from './weather.service';


const mockData = {
  'coord': {
    'lon': -0.13,
    'lat': 51.51
  },
  'weather': [
    {
      'id': 300,
      'main': 'Drizzle',
      'description': 'light intensity drizzle',
      'icon': '09d'
    }
  ],
  'base': 'stations',
  'main': {
    'temp': 280.32,
    'pressure': 1012,
    'humidity': 81,
    'temp_min': 279.15,
    'temp_max': 281.15
  },
  'visibility': 10000,
  'wind': {
    'speed': 4.1,
    'deg': 12
  },
  'clouds': {
    'all': 90
  },
  'dt': 1485789600,
  'sys': {
    'type': 1,
    'id': 5091,
    'message': 0.0103,
    'country': 'GB',
    'sunrise': 1485762037,
    'sunset': 1485794875
  },
  'id': 2643743,
  'name': 'London',
  'cod': 200
};

const mockForecastData = {
  'cod': '200',
  'message': 0.2282,
  'cnt': 2,
  'list': [
    {
      'dt': 1509062400,
      'main': {
        'temp': 285.31,
        'temp_min': 285.31,
        'temp_max': 286.072,
        'pressure': 1035.6,
        'sea_level': 1041.86,
        'grnd_level': 1035.6,
        'humidity': 99,
        'temp_kf': -0.77
      },
      'weather': [
        {
          'id': 500,
          'main': 'Rain',
          'description': 'light rain',
          'icon': '10n'
        }
      ],
      'clouds': {
        'all': 68
      },
      'wind': {
        'speed': 1.31,
        'deg': 326.501
      },
      'rain': {
        '3h': 0.165
      },
      'sys': {
        'pod': 'n'
      },
      'dt_txt': '2017-10-27 00:00:00'
    },
    {
      'dt': 1509073200,
      'main': {
        'temp': 284.7,
        'temp_min': 284.7,
        'temp_max': 285.213,
        'pressure': 1035.95,
        'sea_level': 1042.29,
        'grnd_level': 1035.95,
        'humidity': 100,
        'temp_kf': -0.51
      },
      'weather': [
        {
          'id': 500,
          'main': 'Rain',
          'description': 'light rain',
          'icon': '10n'
        }
      ],
      'clouds': {
        'all': 76
      },
      'wind': {
        'speed': 1.06,
        'deg': 12.0053
      },
      'rain': {
        '3h': 0.065
      },
      'sys': {
        'pod': 'n'
      },
      'dt_txt': '2017-10-27 03:00:00'
    }
  ],
  'city': {
    'name': 'Ploudiry',
    'coord': {
      'lat': 48.45,
      'lon': -4.15
    },
    'country': 'FR'
  }
};

describe('WeatherService', () => {
  const api_key = 'abcdef123456';
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

  it('should have getWeather that return the current weather', (done) => {
    service.getWeather().subscribe(
      (result: any) => {
        expect(result.temperature).toEqual(Math.round(mockData.main.temp));
        expect(result.cloudiness).toEqual(mockData.clouds.all);
        done();
      });
      const request = httpMock.expectOne(
        'http://api.openweathermap.org/data/2.5/weather?'
        + 'apikey=abcdef123456&'
        + 'units=metric&'
        + 'q=Paris,fr');
      request.flush(mockData);
      httpMock.verify();
  });

  it('should handle HTTP errors properly in getWeather', (done) => {
    service.getWeather().subscribe(
      (result: any) => {
        expect(result.error).toBe(true);
        done();
      });
    const request = httpMock.expectOne(
      'http://api.openweathermap.org/data/2.5/weather?'
      + 'apikey=abcdef123456&'
      + 'units=metric&'
      + 'q=Paris,fr');
    request.error(new ErrorEvent('Error from Weather API'));
    httpMock.verify();
  });

  it('should have getForecast that return the weather forecast', (done) => {
    service.getForecast().subscribe(
      (result: any) => {
        expect(result.city.name).toEqual('Ploudiry');
        expect(result.cnt).toEqual(2);
        expect(result.list[0].main.temp).toEqual(285.31);
        done();
      });
      const request = httpMock.expectOne(
        'http://api.openweathermap.org/data/2.5/forecast?'
        + 'apikey=abcdef123456&'
        + 'units=metric&'
        + 'q=Paris,fr');
      request.flush(mockForecastData);
      httpMock.verify();
  });

});

describe('Weather', () => {
  let weather;

  beforeEach(() => {
    weather = new Weather(18.26, 57, <WeatherItem>{main: 'Fog', description: 'fog'});
  });

  it('should be created', () => {
    expect(weather).toBeTruthy();
    expect(weather.temperature).toEqual(18);
    expect(weather.cloudiness).toEqual(57);
    expect(weather.main).toEqual('Fog');
    expect(weather.description).toEqual('fog');
  });

  it('should not accept values < 0 or > 100 for cloudiness', () => {
    // tslint:disable-next-line:no-unused-expression
    expect(() => {new Weather(5, -4, null)}).toThrow(new Error('Unvalid cloudiness.'));
    // tslint:disable-next-line:no-unused-expression
    expect(() => {new Weather(5, 110, null)}).toThrow(new Error('Unvalid cloudiness.'));
  });

  it('is created properly from WeatherResponse', () => {
    const weatherInst = Weather.fromWeatherResponse(<WeatherResponse>mockData);
    expect(weatherInst.temperature).toEqual(Math.round(mockData.main.temp));
    expect(weatherInst.cloudiness).toEqual(mockData.clouds.all);
  });

  it('should get a wi icon from iconMapping', () => {
    const weatherInst = Weather.fromWeatherResponse(<WeatherResponse>mockData);
    expect(weatherInst.getIcon()).toEqual('wi-hail');
  });

});
