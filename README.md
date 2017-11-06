# Raspberry Pi Electron Alarm Clock

[![Build](https://travis-ci.org/asadones/RBPAlarmClock-SA.svg?branch=master)](https://travis-ci.org/asadones/RBPAlarmClock-SA)
[![CircleCI](https://circleci.com/gh/asadones/raspberry-electron-clock.svg?style=shield)](https://circleci.com/gh/asadones/raspberry-electron-clock)
[![Codecov](https://codecov.io/github/asadones/raspberry-electron-clock/branch/master/graph/badge.svg)](https://codecov.io/github/asadones/raspberry-electron-clock/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This project is an attempt to build a connected Alarm Clock for Raspberry Pi 3 Model B, based on
web technologies but as a standalone application on top of Electron.

More details on Electron [here](https://electron.atom.io).

It also uses angular 4, with the inspiration of the [angular-electron](https://github.com/maximegris/angular-electron) bootstrap project.

## Setup

In order to set the project up, install nodejs and npm. Then, run the following:

```
npm i -g yarn
git clone https://github.com/asadones/raspberry-electron-clock.git
cd RBPAlarmClock-SA
yarn install
```

This clock embeds some weather forecast features. It is based on [OpenWeatherMap.org](https://openweathermap.org).
If you want the weather forecast to be available, you need to setup the API key for the API, so please follow the
steps explained in their [documentation](http://openweathermap.org/appid).

Once you get the API key generated, configure it in the ".env" file (it should not exist yet):
```
WEATHER_API_KEY=<your API key here>
```

Then you should be able to start the application:
```
yarn electron:dev
```
