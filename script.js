async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
    alert("Something went wrong");
    throw error; // rethrow so caller knows it failed
  }
}

async function getData(countryName) {
  const url = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

  try {
    const result = await fetchData(url);
    console.log(result);
    console.log(result[0].capital);

    const population = result[0].population.toLocaleString();
    const currencies = result[0].currencies
      ? Object.values(result[0].currencies)
          .map((c) => `${c.name} (${c.symbol || ""})`)
          .join(", ")
      : "N/A";

    mainContainer.innerHTML = `
      <img src="${result[0].flags.png}" alt="country-flag" />
      <h2>${result[0].name.common}</h2>
      <p><strong>Capital:</strong> ${result[0].capital}</p>
      <p><strong>Population:</strong> ${population}</p>
      <p><strong>Currency:</strong> ${currencies}</p>
    `;
  } catch (error) {
    console.error(error.message);
  }
}

submitBtn.addEventListener("click", function () {
  const userInput = document.getElementById("country-name").value;
  getData(userInput);
});
