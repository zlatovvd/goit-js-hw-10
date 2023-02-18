import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';

const search = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

search.addEventListener('input', onShearch);
const DEBOUNCE_DELAY = 300;

const doFetch = debounce(name => {
  fetchCountries(name)
    .then(data => {
      if (data.length > 10) {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length >= 2 && data.length <= 10) {
        markupCountries(data);
      }
      if (data.length === 1) {
        markupCountryInfo(data);
      }
    })
    .catch(error => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}, DEBOUNCE_DELAY);

function onShearch(event) {
  if (!event.currentTarget.value.trim()) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  doFetch(event.currentTarget.value.trim());
}

function markupCountries(data) {
  let markup = data
    .map(
      item => `<li><object
      data="${item.flags.svg}"
      width="25" height="25
      type="image/svg+xml"
    ></object>
    ${item.name.official}
  </li>`
    )
    .join('');

  countryInfo.innerHTML = '';
  countryList.innerHTML = markup;
}

function markupCountryInfo(data) {
  let markup = `
  <div class='country-info-name'>
    <object
      data="${data[0].flags.svg}"
      width="25" height="25
      type="image/svg+xml"
    ></object>
    ${data[0].name.official}</div>
  <ul class="country-info-list">
    <li><strong>Capital:</strong> ${data[0].capital}</li>
    <li><strong>Population:</strong> ${data[0].population}</li>
    <li><strong>Languages:</strong> ${Object.values(data[0].languages)}</li>
  </ul>`;
  countryList.innerHTML = '';
  countryInfo.innerHTML = markup;
}
