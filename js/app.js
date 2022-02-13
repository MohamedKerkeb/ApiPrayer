const city = document.getElementById('city');
const country = document.getElementById('country');
const timezone = document.getElementById('timezone');
const gregorian = document.getElementById('gregorian');
const hijri = document.getElementById('hijri');

const heure = document.getElementById('heure');

const fajr = document.getElementById('fajr');
const dhuhr = document.getElementById('dhuhr');
const asr = document.getElementById('asr');
const maghrib = document.getElementById('maghrib');
const isha = document.getElementById('isha');

var adhan = require('adhan');
const moment = require('moment-timezone');

hijri.innerText = new Intl.DateTimeFormat('ar-TN-u-ca-islamic', {
	day: 'numeric',
	month: 'long',
	weekday: 'long',
	year: 'numeric',
}).format(Date.now());

/**
 * Géolocalisation
 */
function geoFindMe() {
	if (!navigator.geolocation) {
		console.log('Geolocation is not supported by your browser');
		return;
	}
	function success(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		console.log(latitude, longitude);
		getPrayer(longitude, latitude);
		reverseGeo(longitude, latitude);
	}
	function error() {
		console.log('Unable to retrieve your location');
	}
	navigator.geolocation.getCurrentPosition(success, error);
}

/**
 * reverse la géolocalisation
 * @param {*} longitude
 * @param {*} latitude
 */

async function reverseGeo(longitude, latitude) {
	const response = await fetch(
		`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
	);
	const day = await response.json();
	//console.log(day);
	country.innerText = day.address.country;
	city.innerText = day.address.state;
	//console.log(day.address.state);
}

geoFindMe();

/**
 * Horloge
 */

function updateTime() {
	const now = moment();
	const humanReadable = now.format('HH:mm:ss');
	heure.textContent = humanReadable;
}

setInterval(updateTime, 1000);
updateTime();

// test npm adhan

// Intl.DateTimeFormat().resolvedOptions().timeZone;

function getPrayer(longitude, latitude) {
	var coordinates = new adhan.Coordinates(latitude, longitude);
	var dateP = new Date();

	gregorian.innerText = dateP.toLocaleDateString();

	document.getElementById('guess').innerText = moment.tz.guess();
	const guess = moment.tz.guess();

	var params = adhan.CalculationMethod.Qatar();
	params.madhab = adhan.Madhab.Shafi;
	params.polarCircleResolution = adhan.PolarCircleResolution.AqrabYaum;
	params.adjustments.fajr = 2;

	var prayerTimes = new adhan.PrayerTimes(coordinates, dateP, params);
	console.log(prayerTimes);

	// moment.tz.setDefault(moment.tz.guess());
	// console.log(moment.tz());

	var fajrTime = moment(prayerTimes.fajr).tz(`${guess}`).format('HH:mm');
	var sunriseTime = moment(prayerTimes.sunrise).tz(`${guess}`).format('HH:mm');
	var dhuhrTime = moment(prayerTimes.dhuhr).tz(`${guess}`).format('HH:mm');
	var asrTime = moment(prayerTimes.asr).tz(`${guess}`).format('HH:mm');
	var maghribTime = moment(prayerTimes.maghrib).tz(`${guess}`).format('HH:mm');
	var ishaTime = moment(prayerTimes.isha).tz(`${guess}`).format('HH:mm');

	var current = prayerTimes.currentPrayer();
	var next = prayerTimes.nextPrayer();
	var nextPrayerTime = prayerTimes.timeForPrayer(next);
	showPrayer(fajrTime, sunriseTime, dhuhrTime, asrTime, maghribTime, ishaTime);
}

function showPrayer(fajrTime, sunriseTime, dhuhrTime, asrTime, maghribTime, ishaTime) {
	fajr.innerHTML = `
      <div class="box">
        <h4>FAJR</h4>
        <div class="salath">${fajrTime}</div>
      </div>
    `;
	dhuhr.innerHTML = `
      <div class="box">
        <h4>DHUHR</h4>
        <div class="salath">${dhuhrTime}</div>
      </div>
    `;
	asr.innerHTML = `
      <div class="box">
        <h4>asr</h4>
        <div class="salath">${asrTime}</div>
      </div>
    `;
	maghrib.innerHTML = `
      <div class="box">
        <h4>maghrib</h4>
        <div class="salath">${maghribTime}</div>
      </div>
    `;
	isha.innerHTML = `
      <div class="box">
        <h4>isha</h4>
        <div class="salath">${ishaTime}</div>
      </div>
    `;
}

// console.log('fajr', fajrTime, sunriseTime, dhuhrTime, asrTime, maghribTime, ishaTime);
// console.log(prayerTimes);
//console.log(moment.tz.names());

// const date = new Date();
// console.log(date.getFullYear(), date.getDate(), date.getMonth());

// Api

//const urlDay = `https://api.pray.zone/v2/times/today.json?city=paris`;
//const urlMonth = `http://api.aladhan.com/v1/calendarByCity?city=Paris&country=french&method=6&month=02&year=2022`;

// async function fetchDay() {
// 	const response = await fetch(urlDay);
// 	const day = await response.json();
// 	return day;
// }

// fetchDay().then((day) => {
// 	//console.log(day);
// 	const results = day.results;
// 	city.innerHTML = results.location.city;
// 	country.innerHTML = results.location.country;
// 	timezone.innerHTML = results.location.timezone;
// 	gregorian.innerHTML = results.datetime[0].date.gregorian;
// 	hijri.innerHTML = results.datetime[0].date.hijri;
// });

// async function fetchMonth() {
// 	const response = await fetch(urlMonth);
// 	const month = await response.json();
// 	return month;
// }

// fetchMonth().then((month) => {
// 	console.log(month);
// });
