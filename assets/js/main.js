import '../css/main.css';

const API_KEY = '3abd3e7b70aba327ee2b70bd62f49d1c';

const API_ENDPOINT = {
   GEOCODING_API: {
      endpoint: 'http://api.openweathermap.org/geo/1.0/direct?q={CITY_NAME}&limit={RETRIEVAL_LIMIT}&appid={API_KEY}',
      regex: {
         'cityName': '{CITY_NAME}',
         'retrievalLimit': '{RETRIEVAL_LIMIT}',
         'apiKey': '{API_KEY}',
      }
   }
}

const APP = document.querySelector('main.app');
const SEARCH_BUTTON = document.querySelector('button#search-button');

SEARCH_BUTTON.addEventListener('click', (e) => {
   // if (CONTAINER.classList.contains('container--expanded')) {
   //    CONTAINER.classList.remove('container--expanded')
   // }

   APP.classList.toggle('expand')
})