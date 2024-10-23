## Introduction

This project is created in accordance to the requirements of the take home assignment provided by Merquri.

## Requirements

1. Display Information based on mockup UI
2. User can input city and country name to get weather information and display them on UI. Please use AJAX to get weather information from OpenWeatherAPI([https://openweathermap.org/api](https://openweathermap.org/api)).
3. User can find their records in search history, and can click search button to call api again. Can click delete button to remove the record.
4. If user inputs invalid city or country name, show appropriate message on UI.
5. Can build either light or dark theme or both

## Instructions

1. Clone this repository onto your local device
2. In the root folder, create a file and name it '.env'
3. If you have not already done so, create an OpenWeatherAPI account at [https://openweathermap.org/api](https://openweathermap.org/api) and take not of your API key
4. Inside the '.env' file, paste the following text, replacing with your own relevant API key:
```
REACT_APP_OPEN_WEATHER_API_ENDPOINT=https://api.openweathermap.org
REACT_APP_OPEN_WEATHER_API_KEY={your_api_key_here}
```
5. Install all dependencies by running `npm install` in your terminal in the root folder
6. Finally, run `npm start`
