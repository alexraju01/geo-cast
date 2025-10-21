// Constants variable
const COUNTRY_URL = `https://restcountries.com/v3.1/name/`;
const OPEN_WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const OPEN_WEATHER_API_KEY = "b3ef07cd5bbcb14775ea343177826168";

const countryInput = document.getElementById("country-input");
const searchSection = document.getElementById("search-section");
const resultsSection = document.getElementById("results-section");
const loadingSpinner = document.getElementById("loading-spinner");
const messageDiv = document.getElementById("message-area");

async function fetchData(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			if (response.status === 404) {
				throw new Error("Location or resource not found.");
			}
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error(error.message);
		throw error;
	}
}

const hideUI = () => {
	resultsSection.style.display = "none";
	loadingSpinner.style.display = "none";
	messageDiv.style.display = "none";
};

const displayMessage = (message, isError = true) => {
	console.log("Display Message:", message);
	messageDiv.textContent = message;
	messageDiv.style.color = isError ? "#ef4444" : "#22c55e";
	messageDiv.style.display = "block";
};

async function fetchCountryData() {
	hideUI();
	const countryName = countryInput.value.trim();

	if (!countryName) {
		displayMessage("Please enter a country name.", true);
		return;
	}

	try {
		const countryUrl = `${COUNTRY_URL}${encodeURIComponent(countryName)}?fullText=true`;
		const countryData = await fetchData(countryUrl);
		console.log(countryData.length);

		if (!countryData || countryData.length === 0) {
			displayMessage("Country not found.", true);
		}

		const country = countryData[0];
		const capital = country.capital ? country.capital[0] : null;

		loadingSpinner.style.display = "flex";
		updateCountryCard(country);

		// 2. Fetch Weather Data (OpenWeatherMap API)
		if (capital) {
			await fetchCapitalWeather(capital);
		} else {
			displayMessage(`Country details loaded, but no capital city found to fetch weather.`, false);
		}
		resultsSection.style.display = "grid";
	} catch (error) {
		console.error(error.message);
		displayMessage(`Error: ${error.message}. Please try a different country name.`, true);
	} finally {
		loadingSpinner.style.display = "none";
	}
}

function updateCountryCard(country) {
	const population = country.population;
	const currencyKey = Object.keys(country.currencies || {});
	const currency = currencyKey.length > 0 ? `${country.currencies[currencyKey[0]].name}` : "N/A";
	const language = country.languages ? Object.values(country.languages).join(", ") : "N/A";
	const capital = country.capital ? country.capital[0] : "N/A";

	console.log(country.languages);
	document.getElementById("country-name").textContent = country.name.common;
	document.getElementById("country-flag").src = country.flags.png;
	document.getElementById("country-flag").alt = `${country.name.common} flag`;
	document.getElementById("country-population").textContent = population.toLocaleString();
	document.getElementById("country-currency").textContent = currency;
	document.getElementById("country-languages").textContent = language;
	document.getElementById("country-capital").textContent = capital;
}

async function fetchCapitalWeather(capitalName) {
	const weatherCard = document.getElementById("weather-card");

	if (!OPEN_WEATHER_API_KEY) {
		document.getElementById("weather-temp").textContent = "Key Missing";
		document.getElementById("weather-desc").textContent = "API Key needed for OpenWeatherMap";
		displayMessage("OpenWeatherMap API requires an API key for live data.", true);
		return;
	}

	const weatherUrl = `${OPEN_WEATHER_BASE_URL}?q=${encodeURIComponent(
		capitalName
	)}&appid=${OPEN_WEATHER_API_KEY}&units=metric`;

	try {
		const weatherData = await fetchData(weatherUrl);

		// Update Weather Card
		const temp = Math.round(weatherData.main.temp);
		const feels = Math.round(weatherData.main.feels_like);
		const desc = weatherData.weather[0].description;
		const iconCode = weatherData.weather[0].icon;
		const humidity = weatherData.main.humidity;
		const wind = weatherData.wind.speed; // meters/sec by default for metric

		document.getElementById("weather-temp").textContent = `${temp}°C`;
		document.getElementById("weather-desc").textContent =
			desc.charAt(0).toUpperCase() + desc.slice(1);
		document.getElementById(
			"weather-city"
		).textContent = `${capitalName}, ${weatherData.sys.country}`;
		document.getElementById(
			"weather-icon"
		).src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
		document.getElementById("weather-feels").textContent = `${feels}°C`;
		document.getElementById("weather-humidity").textContent = `${humidity}%`;
		document.getElementById("weather-wind").textContent = `${wind} m/s`;
		document.getElementById("weather-icon").style.display = "block";
	} catch (error) {
		console.error("Weather Fetch Error:", error);
		document.getElementById("weather-temp").textContent = "N/A";
		document.getElementById("weather-desc").textContent = "Weather data unavailable";
		document.getElementById("weather-city").textContent = capitalName;
		document.getElementById("weather-feels").textContent = "--";
		document.getElementById("weather-humidity").textContent = "--";
		document.getElementById("weather-wind").textContent = "--";
		document.getElementById("weather-icon").style.display = "none";

		displayMessage(`Weather data for ${capitalName} failed to load.`, true);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	displayMessage("Enter a country name and press 'Search' ", false);
});
