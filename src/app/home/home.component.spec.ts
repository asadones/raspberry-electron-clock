import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as sinon from 'sinon';

import { HomeComponent } from './home.component';
import { WeatherService, Weather } from '../providers/weather.service';


class MockWeatherService {
  getWeather = () => Observable.of(Weather)
  getForecast = () => Observable.of(Weather)
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let clock;
  let sandbox;
  let weatherStub;
  let forecastStub;

  function stubWeatherService(service: WeatherService) {
    weatherStub = sinon.stub(service, 'getWeather')
    weatherStub.returns(Observable.of(Weather));
    forecastStub = sinon.stub(service, 'getForecast')
    forecastStub.returns(Observable.of(Weather));
  }

  function restoreWeatherService() {
    weatherStub.restore();
    forecastStub.restore();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HttpClientModule],
      providers: [
        {
          provide: WeatherService,
          useClass: MockWeatherService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sinon.useFakeTimers({shouldAdvanceTime: false});
  });

  it('should create and init', inject([WeatherService], (service: WeatherService) => {
    stubWeatherService(service);
    component = new HomeComponent(service);
    expect(component).toBeTruthy();
    expect(forecastStub.called).toBe(true);
    expect(weatherStub.called).toBe(true);
    expect(component.currentDateTime).toEqual(0);
    restoreWeatherService();
  }));

  it('should increment currentDateTime every second', inject([WeatherService],
    (service: WeatherService) => {
      component = new HomeComponent(service);
      const initTime = component.currentDateTime;
      clock.tick(999);
      expect(component.currentDateTime).toEqual(0);
      clock.tick(1);
      expect(component.currentDateTime).toEqual(1 * 1000);
  }));

  it('should update weather every minute', inject([WeatherService],
    (service: WeatherService) => {
      component = new HomeComponent(service);
      stubWeatherService(service);
      clock.tick(59 * 1000);
      expect(weatherStub.called).toBe(false);
      clock.tick(1 * 1000);
      expect(weatherStub.called).toBe(true);
      restoreWeatherService();
  }));

  it('should update forecast every hour', inject([WeatherService],
    (service: WeatherService) => {
      component = new HomeComponent(service);
      stubWeatherService(service);
      clock.tick((60 * 60 - 1) * 1000);
      expect(forecastStub.called).toBe(false);
      clock.tick(1 * 1000);
      expect(forecastStub.called).toBe(true);
      restoreWeatherService();
  }));

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

});
