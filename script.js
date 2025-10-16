async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
    alert("Something went wrong. Please try again.");
    throw error;
  }
}

async function fetchCountryData() {
  const input = document.getElementById("country-input");
  const countryName = input.value.trim();

  if (!countryName) {
    alert("Please enter a country name.");
    return;
  }

  const url = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

  try {
    const result = await fetchData(url);
    const country = result[0];

    // Extract data
    const flag = country.flags?.png || country.flags?.svg || "";
    const population = country.population.toLocaleString();
    const currencies = country.currencies
      ? Object.values(country.currencies)
          .map((c) => `${c.name} (${c.symbol || ""})`)
          .join(", ")
      : "N/A";

    // Update HTML
    document.getElementById("country-flag").src = flag;
    document.getElementById("country-flag").alt = `${country.name.common} flag`;
    document.getElementById("country-population").textContent = population;
    document.getElementById("country-currency").textContent = currencies;
    document.getElementById("country-name").textContent = country.name.common;

  } catch (error) {
    console.error(error.message);
  }
}
