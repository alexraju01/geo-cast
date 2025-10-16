// Constants variable
const COUNTRY_URL = `https://restcountries.com/v3.1/name/`;

const countryInput = document.getElementById("country-input");
const searchSection = document.getElementById("search-section");

async function fetchData(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error(error.message);
		throw error;
	}
}

async function fetchCountryData() {
	const CountryName = countryInput.value.trim();

	try {
		const countryUrl = `${COUNTRY_URL}${CountryName}?fullText=true`;
		const result = await fetchData(countryUrl);

		const countryData = result[0];

		if (!countryData || countryData.length === 0) {
			throw new Error("Country not found.");
		}

		const country = countryData;

		updateCountryCard(country);
	} catch (error) {
		console.error(error.message);
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
