import '../css/main.css';
import clearIcon from '../images/wt-1.svg';
import hazeIcon from '../images/wt-3.svg';
import cloudsIcon from '../images/wt-7.svg';
import fogIcon from '../images/wt-9.svg';
import rainIcon from '../images/wt-19.svg';
import thunderstormIcon from '../images/wt-22.svg';
import snowIcon from '../images/wt-30.svg';
import unknownIcon from '../images/wt-36.svg';

const ENV = {
   cityName: 'Fortaleza',
   retrievalLimit: 1,
   apiKey: '3abd3e7b70aba327ee2b70bd62f49d1c'
}

const WEATHER_IMAGE = {
   Clear: clearIcon,
   Haze: hazeIcon,
   Clouds: cloudsIcon,
   Fog: fogIcon,
   Rain: rainIcon,
   Thunderstorm: thunderstormIcon,
   Snow: snowIcon,
   Unknown: unknownIcon,
}

const GEOCODING_API = {
   endpoint: 'https://api.openweathermap.org/geo/1.0/direct?q={CITY_NAME}&limit={RETRIEVAL_LIMIT}&appid={API_KEY}',
   regex: {
      cityName: '{CITY_NAME}',
      retrievalLimit: '{RETRIEVAL_LIMIT}',
      apiKey: '{API_KEY}',
   }
}

const CURRENT_WEATHER_API = {
   endpoint: 'https://api.openweathermap.org/data/2.5/weather?lat={LATITUDE}&lon={LONGITUDE}&appid={API_KEY}&units=metric',
   regex: {
      latitude: '{LATITUDE}',
      longitude: '{LONGITUDE}',
      apiKey: '{API_KEY}',
   }
}

const APP = document.querySelector('main.app');
const SEARCHBOX_INPUT = document.querySelector('input.searchbox__input');
const SEARCH_BUTTON = document.querySelector('button#search-button');
const LOCATION_NOTFOUND = document.querySelector('div.location__notfound');
const LOCATION_WEATHER = document.querySelector('div.location__weather');
const FORECAST_METRICS = document.querySelector('div.forecast__metrics');
const FORECAST_DETAILS = document.querySelector('div.forecast__detail');
const FORECAST_IMAGE = document.querySelector('span.forecast__image > object');

let hasBeenUsedBefore = false;
let hasLocationBeenFound = false;

SEARCH_BUTTON.addEventListener('click', (e) => {
   handleSearchButtonClickEvent(e);
})

const handleSearchButtonClickEvent = async (e) => {

   if (!hasBeenUsedBefore) {
      APP.classList.toggle('animation-expand')
      hasBeenUsedBefore = true;
   }

   let result = await fetchLocation(SEARCHBOX_INPUT.value);

   if (result) {

      hasLocationBeenFound = true;
      updateWeatherForecast(result);

   } else {
      hasLocationBeenFound = false;
   }

   if (!hasLocationBeenFound) {

      if (!hasBeenUsedBefore) {
         LOCATION_NOTFOUND.classList.add('display-flex');
         LOCATION_NOTFOUND.classList.add('animation-fade-in');
      } else {
         LOCATION_WEATHER.classList.remove('display-flex');
         LOCATION_WEATHER.classList.remove('animation-fade-in');
         LOCATION_NOTFOUND.classList.add('display-flex');
         LOCATION_NOTFOUND.classList.add('animation-fade-in');
      }

   } else {

      if (!hasBeenUsedBefore) {
         LOCATION_WEATHER.classList.add('display-flex');
         LOCATION_WEATHER.classList.add('animation-fade-in');
      } else {
         LOCATION_NOTFOUND.classList.remove('display-flex');
         LOCATION_NOTFOUND.classList.remove('animation-fade-in');
         LOCATION_WEATHER.classList.add('display-flex');
         LOCATION_WEATHER.classList.add('animation-fade-in');
      }

   }
}

const updateWeatherForecast = async (data) => {

   let result = await fetchWeather(data);

   SEARCHBOX_INPUT.value = `${data.name}, ${data.country}`;

   FORECAST_IMAGE.setAttribute('data', WEATHER_IMAGE[result.weather[0].main] ?? WEATHER_IMAGE['Unknown']);

   let hygenizedData = {
      temperature: `${(result.main.temp).toString().split('.')[0]}`,
      description: capitalizeFirstLetter(result.weather[0].description),
      humidity: `${result.main.humidity}%`,
      windspeed: `${(result.wind.speed).toString().split('.')[0]}Km/h`,
   }

   FORECAST_METRICS.querySelector('span.forecast__temperature > p:first-child').textContent = hygenizedData.temperature
   FORECAST_METRICS.querySelector('p.forecast__description').textContent = hygenizedData.description;

   FORECAST_DETAILS.querySelector('div.forecast__detail > .weather__item:first-child > .weather__text > p').textContent = hygenizedData.humidity;
   FORECAST_DETAILS.querySelector('div.forecast__detail > .weather__item:last-child > .weather__text > p').textContent = hygenizedData.windspeed;

}

const fetchWeather = async (data) => {
   try {

      let hydratedEndpoint = hydrateEndpoint(
         CURRENT_WEATHER_API.endpoint,
         [
            {
               data: data.lat,
               regex: CURRENT_WEATHER_API.regex['latitude']
            },
            {
               data: data.lon,
               regex: CURRENT_WEATHER_API.regex['longitude']
            },
            {
               data: ENV['apiKey'],
               regex: CURRENT_WEATHER_API.regex['apiKey']
            },
         ]
      )

      return await fetch(hydratedEndpoint)
         .then(response => {
            if (!response.ok) {
               return response.status;
            } else {
               return response.json();
            }
         }).then(data => {
            return data;
         })
   } catch (error) {
      console.log(`Error status: ${error}`);
   }
}

const fetchLocation = async (locationName) => {
   try {

      let hydratedEndpoint = hydrateEndpoint(
         GEOCODING_API.endpoint,
         [
            {
               data: locationName,
               regex: GEOCODING_API.regex['cityName']
            },
            {
               data: ENV['retrievalLimit'],
               regex: GEOCODING_API.regex['retrievalLimit']
            },
            {
               data: ENV['apiKey'],
               regex: GEOCODING_API.regex['apiKey']
            },

         ]
      );

      return await fetch(hydratedEndpoint)
         .then(response => {
            if (!response.ok) {
               return response.status;
            } else {
               return response.json();
            }
         }).then(data => {
            return data.length > 0 ? data[0] : null;
         })
   } catch (error) {
      console.log(`Error status? ${error}`);
   }

}

const hydrateEndpoint = (endpoint, options) => {
   try {
      if (!endpoint || !options) {
         throw new Error('Validation error! All parameters must be provided.');
      } else {
         if (options.length < 2) {
            return endpoint.replace(options.regex, options.data);
         } else {
            options.forEach(option => {
               endpoint = endpoint.replace(option.regex, option.data);
            });
            return endpoint;
         }
      }
   } catch (error) {
      console.log(`Error status: ${error}`);
   }
}

const capitalizeFirstLetter = (value) => {
   let arr = value.split(' ');

   arr.forEach((item, key) => {
      arr[key] = item.charAt(0).toUpperCase() + item.slice(1);
   })

   return arr.join(' ');
}
