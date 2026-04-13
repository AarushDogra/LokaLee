// ===== LOKALEE — api.js =====
// All API fetch functions using async/await + try/catch

// ===== YOUR API KEYS =====
const WEATHER_KEY = "e52c95635d7afd54a91d86431d9c7964";
const OPENTRIP_KEY = "5ae2e3f221c38a28845f05b6096371370e697f7370f3d2d7f61c8abd";
// ===== LOADING MESSAGE =====
function showLoading() {
  document.getElementById("loadingMsg").classList.remove("hidden");
}

function hideLoading() {
  document.getElementById("loadingMsg").classList.add("hidden");
}

// ===== 1. WEATHER API =====
async function fetchWeather(city) {
  try {
    showLoading();
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      WEATHER_KEY +
      "&units=metric"
    );

    if (!response.ok) {
      alert("City not found! Please try another city.");
      return null;
    }

    const data = await response.json();
    return data;

  } catch (error) {
    alert("Something went wrong fetching weather. Check your internet!");
    return null;
  } finally {
    hideLoading();
  }
}

// ===== 2. COUNTRY API — RestCountries (no key needed) =====
async function fetchCountry(countryCode) {
  try {
    showLoading();
    const response = await fetch(
      "https://restcountries.com/v3.1/alpha/" + countryCode
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data[0];

  } catch (error) {
    console.log("Country fetch error: " + error.message);
    return null;
  } finally {
    hideLoading();
  }
}

// ===== 3. OPENTRIPMAP — Get city coordinates =====
async function fetchCityCoords(city) {
  try {
    const response = await fetch(
      "https://api.opentripmap.com/0.1/en/places/geoname?name=" +
      city +
      "&apikey=" +
      OPENTRIP_KEY
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.log("Coords fetch error: " + error.message);
    return null;
  }
}

// ===== 4. OPENTRIPMAP — Get attractions near coordinates =====
async function fetchAttractions(lat, lon, radius, limit) {
  // Default values if not provided
  if (!radius) radius = 5000;
  if (!limit) limit = 20;

  try {
    showLoading();
    const response = await fetch(
      "https://api.opentripmap.com/0.1/en/places/radius?radius=" +
      radius +
      "&lon=" +
      lon +
      "&lat=" +
      lat +
      "&limit=" +
      limit +
      "&apikey=" +
      OPENTRIP_KEY
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    // Return features array or empty array if nothing found
    if (data.features) {
      return data.features;
    } else {
      return [];
    }

  } catch (error) {
    console.log("Attractions fetch error: " + error.message);
    return [];
  } finally {
    hideLoading();
  }
}