// ===== LOKALEE — app.js =====
// Main logic and event listeners

// ===== GLOBAL STATE =====
let currentCity = "";
let allAttractions = [];
let filteredAttractions = [];
let currentPage = 1;
const ATTRACTIONS_PER_PAGE = 8;

// ===== THEME TOGGLE =====
function initTheme() {
  const savedTheme = getSavedTheme();
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeBtn(savedTheme);
}

function updateThemeBtn(theme) {
  const btn = document.getElementById("themeToggle");
  btn.textContent = theme === "dark" ? " Light Mode" : " Dark Mode";
}

document.getElementById("themeToggle").addEventListener("click", function () {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  saveTheme(next);
  updateThemeBtn(next);
});

// ===== DEBOUNCE =====
function debounce(fn, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn();
    }, delay);
  };
}

// ===== MAIN CITY SEARCH =====
async function searchCity(city) {
  if (!city.trim()) {
    alert("Please enter a city name!");
    return;
  }

  currentCity = city.trim();
  saveLastCity(currentCity);

  // Step 1 — fetch and render weather
  const weatherData = await fetchWeather(currentCity);
  if (!weatherData) return;
  renderWeather(weatherData);

  // Step 2 — fetch and render country info
  const countryCode = weatherData.sys.country;
  const countryData = await fetchCountry(countryCode);
  if (countryData) {
    renderCountry(countryData);
  }

  // Step 3 — fetch and render attractions
  const coords = await fetchCityCoords(currentCity);
  if (coords && coords.lat && coords.lon) {
    const attractions = await fetchAttractions(coords.lat, coords.lon);

    // filter() HOF — only keep attractions that have a name
    allAttractions = attractions.filter(function (a) {
      return a.properties && a.properties.name;
    });

    filteredAttractions = allAttractions;
    currentPage = 1;

    // Show attractions section
    document.getElementById("attractionsContainer").classList.remove("hidden");

    renderPage(currentPage);
  }
}

// ===== RENDER CURRENT PAGE =====
function renderPage(page) {
  const pageItems = paginate(filteredAttractions, page, ATTRACTIONS_PER_PAGE);
  renderAttractionsGrid(pageItems);
  renderPagination(filteredAttractions.length, page, ATTRACTIONS_PER_PAGE);
}

// ===== GO TO PAGE — called from pagination buttons =====
function goToPage(page) {
  currentPage = page;
  renderPage(page);
}

// ===== SEARCH ATTRACTIONS =====
const handleAttractionSearch = debounce(function () {
  const query = document.getElementById("attractionSearch").value.toLowerCase();

  // filter() HOF — only keep attractions whose name includes the query
  filteredAttractions = allAttractions.filter(function (a) {
    return a.properties.name.toLowerCase().includes(query);
  });

  currentPage = 1;
  renderPage(currentPage);
}, 400);

document.getElementById("attractionSearch").addEventListener(
  "input",
  handleAttractionSearch
);

// ===== SORT ATTRACTIONS =====
document.getElementById("attractionSort").addEventListener("change", function (e) {
  const sortValue = e.target.value;
  if (!sortValue) return;

  // spread operator to avoid mutating original array
  const sorted = [...filteredAttractions].sort(function (a, b) {
    const nameA = a.properties.name;
    const nameB = b.properties.name;
    if (sortValue === "az") {
      return nameA.localeCompare(nameB);
    }
    if (sortValue === "za") {
      return nameB.localeCompare(nameA);
    }
    return 0;
  });

  filteredAttractions = sorted;
  currentPage = 1;
  renderPage(currentPage);
});

// ===== SEARCH BUTTON =====
document.getElementById("searchBtn").addEventListener("click", function () {
  const city = document.getElementById("citySearch").value;
  searchCity(city);
});

// ===== ENTER KEY SEARCH =====
document.getElementById("citySearch").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const city = document.getElementById("citySearch").value;
    searchCity(city);
  }
});

// ===== INITIALIZE APP =====
async function initApp() {
  // Load saved theme
  initTheme();

  // Load last searched city
  const lastCity = getLastCity();
  if (lastCity) {
    document.getElementById("citySearch").value = lastCity;
    await searchCity(lastCity);
  }
}

// Start the app
initApp();