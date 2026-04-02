
const WEATHER_KEY = "e52c95635d7afd54a91d86431d9c7964";
const OPENTRIP_KEY = "5ae2e3f221c38a28845f05b6096371370e697f7370f3d2d7f61c8abd";
const EXCHANGE_KEY = "4ae5a39784ad814b9bc564bff3c7c3a2";

// ===== SHOW / HIDE SPINNER =====
function showSpinner() {
  document.getElementById("spinner").classList.remove("hidden");
}

function hideSpinner() {
  document.getElementById("spinner").classList.add("hidden");
}

// ===== 1. WEATHER API =====
async function fetchWeather(city) {
  try {
    showSpinner();
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`
    );
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    return data;
  } catch (err) {
    alert("Weather Error: " + err.message);
    return null;
  } finally {
    hideSpinner();
  }
}

// ===== 2. COUNTRY API (RestCountries — no key needed) =====
async function fetchCountry(countryCode) {
  try {
    showSpinner();
    const res = await fetch(
      `https://restcountries.com/v3.1/alpha/${countryCode}`
    );
    if (!res.ok) throw new Error("Country not found");
    const data = await res.json();
    return data[0];
  } catch (err) {
    console.error("Country Error:", err.message);
    return null;
  } finally {
    hideSpinner();
  }
}

// ===== 3. OPENTRIPMAP API =====

// Step 1 — Get coordinates of a city
async function fetchCityCoords(city) {
  try {
    const res = await fetch(
      `https://api.opentripmap.com/0.1/en/places/geoname?name=${city}&apikey=${OPENTRIP_KEY}`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Coords Error:", err.message);
    return null;
  }
}

// Step 2 — Get attractions near coordinates
async function fetchAttractions(lat, lon, radius = 5000, limit = 20) {
  try {
    showSpinner();
    const res = await fetch(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&limit=${limit}&apikey=${OPENTRIP_KEY}`
    );
    const data = await res.json();
    return data.features || [];
  } catch (err) {
    console.error("Attractions Error:", err.message);
    return [];
  } finally {
    hideSpinner();
  }
}

// ===== 4. EXCHANGERATE API =====
async function fetchExchangeRate(baseCurrency) {
  try {
    showSpinner();
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_KEY}/latest/${baseCurrency}`
    );
    if (!res.ok) throw new Error("Exchange rate fetch failed");
    const data = await res.json();
    return data.conversion_rates;
  } catch (err) {
    console.error("Exchange Error:", err.message);
    return null;
  } finally {
    hideSpinner();
  }
}

// ===== 5. THEMEALDB API (no key needed) =====

// Get meals by country/area
async function fetchMealsByArea(area) {
  try {
    showSpinner();
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
    );
    const data = await res.json();
    return data.meals || [];
  } catch (err) {
    console.error("Meals Error:", err.message);
    return [];
  } finally {
    hideSpinner();
  }
}

// Get meals by category
async function fetchMealsByCategory(category) {
  try {
    showSpinner();
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    const data = await res.json();
    return data.meals || [];
  } catch (err) {
    console.error("Meals Category Error:", err.message);
    return [];
  } finally {
    hideSpinner();
  }
}

// Get full meal details by ID
async function fetchMealDetails(id) {
  try {
    showSpinner();
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await res.json();
    return data.meals ? data.meals[0] : null;
  } catch (err) {
    console.error("Meal Details Error:", err.message);
    return null;
  } finally {
    hideSpinner();
  }
}

// Get a random meal for Food of the Day
async function fetchRandomMeal() {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/random.php`
    );
    const data = await res.json();
    return data.meals ? data.meals[0] : null;
  } catch (err) {
    console.error("Random Meal Error:", err.message);
    return null;
  }
}