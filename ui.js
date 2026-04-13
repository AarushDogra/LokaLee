// ===== LOKALEE — ui.js =====
// All DOM rendering functions

// ===== RENDER WEATHER CARD =====
function renderWeather(data) {
  const card = document.getElementById("weatherCard");
  const content = document.getElementById("weatherContent");

  const cityName = data.name;
  const countryCode = data.sys.country;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const description = data.weather[0].description;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const icon = data.weather[0].icon;
  const iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

  content.innerHTML =
    "<div class='weather-info'>" +
      "<img src='" + iconUrl + "' alt='" + description + "' />" +
      "<div>" +
        "<h2>" + cityName + ", " + countryCode + "</h2>" +
        "<h3>" + temp + "°C</h3>" +
        "<p>🌤️ " + description + "</p>" +
        "<p>💧 Humidity: " + humidity + "%</p>" +
        "<p>💨 Wind: " + wind + " m/s</p>" +
        "<p>🌡️ Feels like: " + feelsLike + "°C</p>" +
      "</div>" +
    "</div>";

  card.classList.remove("hidden");
}

// ===== RENDER COUNTRY CARD =====
function renderCountry(data) {
  const card = document.getElementById("countryCard");
  const content = document.getElementById("countryContent");

  const countryName = data.name.common;
  const capital = data.capital ? data.capital[0] : "N/A";
  const region = data.region;
  const population = data.population.toLocaleString();
  const flag = data.flags.png;

  // Get currency using Object.values()
  const currencies = Object.values(data.currencies || {});
  const currency = currencies.length > 0 ? currencies[0] : null;
  const currencyName = currency ? currency.name : "N/A";
  const currencySymbol = currency ? currency.symbol : "";

  // Get languages using Object.values()
  const languages = Object.values(data.languages || {}).join(", ");

  content.innerHTML =
    "<div class='country-info'>" +
      "<img src='" + flag + "' alt='" + countryName + " flag' />" +
      "<div>" +
        "<h2>" + countryName + "</h2>" +
        "<p>🏙️ Capital: <strong>" + capital + "</strong></p>" +
        "<p>🌍 Region: <strong>" + region + "</strong></p>" +
        "<p>👥 Population: <strong>" + population + "</strong></p>" +
        "<p>💱 Currency: <strong>" + currencyName + " (" + currencySymbol + ")</strong></p>" +
        "<p>🗣️ Language: <strong>" + languages + "</strong></p>" +
      "</div>" +
    "</div>";

  card.classList.remove("hidden");
}

// ===== RENDER ATTRACTIONS GRID =====
function renderAttractionsGrid(attractions) {
  const grid = document.getElementById("attractionsGrid");

  if (!attractions || attractions.length === 0) {
    grid.innerHTML = "<p style='color:var(--subtext)'>No attractions found for this city.</p>";
    return;
  }

  // map() HOF — turn each attraction object into an HTML card string
  const cards = attractions.map(function (attraction) {
    const name = attraction.properties.name;

    // Get first kind/category of the attraction
    const kinds = attraction.properties.kinds;
    const tag = kinds ? kinds.split(",")[0].replace(/_/g, " ") : "attraction";

    return (
      "<div class='grid-card'>" +
        "<h3>📍 " + name + "</h3>" +
        "<span class='tag'>" + tag + "</span>" +
      "</div>"
    );
  });

  grid.innerHTML = cards.join("");
}

// ===== PAGINATION HELPER =====

// Returns a slice of items for the current page
function paginate(items, page, perPage) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return items.slice(start, end);
}

// Renders pagination buttons
function renderPagination(totalItems, currentPage, perPage) {
  const pagination = document.getElementById("attractionsPagination");
  const totalPages = Math.ceil(totalItems / perPage);

  // Array.from + map() HOF — create page buttons
  const buttons = Array.from({ length: totalPages }, function (_, i) {
    const page = i + 1;
    const activeClass = page === currentPage ? "active" : "";
    return (
      "<button class='" + activeClass + "' onclick='goToPage(" + page + ")'>" +
        page +
      "</button>"
    );
  });

  pagination.innerHTML = buttons.join("");
}