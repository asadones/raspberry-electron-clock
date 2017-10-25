import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as sinon from 'sinon';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let clock;
  let sandbox;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sinon.useFakeTimers({shouldAdvanceTime: false});
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init currentDateTime', () => {
    expect(component.currentDateTime).toEqual(0);
  });

  it('should increment currentDateTime over time', () => {
    clock.tick(1000);
    expect(component.currentDateTime).toEqual(1000);
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

});