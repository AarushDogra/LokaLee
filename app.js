// ===== LOKALEE — app.js =====
// Main logic, event listeners, and app initialization

// ===== GLOBAL STATE =====
let currentCity = "";
let currentWeatherData = null;
let currentCountryData = null;
let allMeals = [];
let currentFoodPage = 1;
const MEALS_PER_PAGE = 8;

// ===== THEME TOGGLE =====
function initTheme() {
  const saved = getSavedTheme();
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeBtn(saved);
}

function updateThemeBtn(theme) {
  const btn = document.getElementById("themeToggle");
  btn.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
}

document.getElementById("themeToggle").addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  saveTheme(next);
  updateThemeBtn(next);
});

// ===== DEBOUNCED SEARCH =====
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
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

  // Fetch weather
  const weatherData = await fetchWeather(currentCity);
  if (!weatherData) return;
  currentWeatherData = weatherData;
  renderWeather(weatherData);

  // Fetch country info using country code from weather
  const countryData = await fetchCountry(weatherData.sys.country);
  currentCountryData = countryData;
  if (countryData) renderCountry(countryData);

  // Fetch attractions
  const coords = await fetchCityCoords(currentCity);
  if (coords && coords.lat && coords.lon) {
    const attractions = await fetchAttractions(coords.lat, coords.lon);
    renderAttractionsBudget(attractions);
  }

  // Fetch local meals using country name
  if (countryData) {
    const area = countryData.name.common;
    const meals = await fetchMealsByArea(area);
    if (meals.length > 0) {
      allMeals = meals;
      currentFoodPage = 1;
      renderFoodPage(currentFoodPage);
    }
  }

  // Render backpacker guide
  if (countryData) {
    renderGuide(weatherData, countryData);
  }
}

// Search button click
document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("citySearch").value;
  searchCity(city);
});

// Search on Enter key
document.getElementById("citySearch").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = document.getElementById("citySearch").value;
    searchCity(city);
  }
});

// ===== FAVORITES =====
function handleFavorite(name, country, temp, description) {
  if (isFavorite(name)) {
    removeFavorite(name);
    alert(`💔 ${name} removed from favorites!`);
  } else {
    saveFavorite({ name, country, temp, description });
  }
  // Re-render weather card to update button
  if (currentWeatherData) renderWeather(currentWeatherData);
  renderFavorites();
}

function removeFavoriteAndRefresh(cityName) {
  removeFavorite(cityName);
  renderFavorites();
}

// ===== BUDGET PLANNER =====
document.getElementById("calcBudget").addEventListener("click", async () => {
  const budget = parseFloat(document.getElementById("totalBudget").value);
  const days = parseInt(document.getElementById("tripDays").value);
  const currency = document.getElementById("budgetCurrency").value;

  if (!budget || !days || budget <= 0 || days <= 0) {
    alert("Please enter a valid budget and number of days!");
    return;
  }

  const rates = await fetchExchangeRate("USD");
  renderBudgetResult(budget, days, rates, currency);
});

// Render attractions filtered by budget
function renderAttractionsBudget(attractions) {
  const container = document.getElementById("attractionsByBudget");
  if (!attractions || attractions.length === 0) return;

  // Use .filter() HOF — show only named attractions
  const named = attractions.filter(
    (a) => a.properties && a.properties.name
  );

  // Use .map() HOF — render list
  const list = named.slice(0, 10).map((a) => `
    <li style="margin-bottom:0.5rem; color:var(--subtext)">
      📍 ${a.properties.name}
      ${a.properties.kinds
        ? `<span style="font-size:0.8rem; color:var(--primary)">
            — ${a.properties.kinds.split(",")[0]}
           </span>`
        : ""}
    </li>
  `).join("");

  container.innerHTML = `
    <h3 style="color:var(--primary); margin-bottom:1rem">
      🏛️ Nearby Attractions in ${currentCity}
    </h3>
    <ul style="padding-left:1.2rem">${list}</ul>
  `;
  container.classList.remove("hidden");
}

// ===== DESTINATION COMPARISON =====
document.getElementById("compareBtn").addEventListener("click", async () => {
  const city1 = document.getElementById("compareCity1").value.trim();
  const city2 = document.getElementById("compareCity2").value.trim();
  const city3 = document.getElementById("compareCity3").value.trim();

  const cities = [city1, city2, city3].filter((c) => c !== "");

  if (cities.length < 2) {
    alert("Please enter at least 2 cities to compare!");
    return;
  }

  // Fetch weather for all cities in parallel
  const results = await Promise.all(
    cities.map(async (city) => {
      const weather = await fetchWeather(city);
      const coords = await fetchCityCoords(city);
      let attractionCount = 0;

      if (coords && coords.lat && coords.lon) {
        const attractions = await fetchAttractions(
          coords.lat, coords.lon, 5000, 20
        );
        // Use .filter() to count named attractions
        attractionCount = attractions.filter(
          (a) => a.properties && a.properties.name
        ).length;
      }

      return {
        city: weather ? weather.name : city,
        temp: weather ? Math.round(weather.main.temp) : "N/A",
        weather: weather ? weather.weather[0].description : "N/A",
        humidity: weather ? weather.main.humidity : "N/A",
        country: weather ? weather.sys.country : "N/A",
        attractions: attractionCount,
      };
    })
  );

  // Sort by temperature using .sort() HOF
  results.sort((a, b) => b.temp - a.temp);
  renderCompareCards(results);
});

// ===== FOOD EXPLORER =====

// Render current page of meals
function renderFoodPage(page) {
  const paged = paginate(allMeals, page, MEALS_PER_PAGE);
  renderFoodGrid(paged);
  renderPagination(allMeals.length, page, MEALS_PER_PAGE, "goToFoodPage");
}

// Go to a specific page
function goToFoodPage(page) {
  currentFoodPage = page;
  renderFoodPage(page);
}

// Search meals with debounce using .filter() HOF
const handleFoodSearch = debounce(() => {
  const query = document.getElementById("foodSearch").value.toLowerCase();
  const filtered = allMeals.filter((meal) =>
    meal.strMeal.toLowerCase().includes(query)
  );
  renderFoodGrid(filtered);
}, 400);

document.getElementById("foodSearch").addEventListener("input", handleFoodSearch);

// Filter meals by category
document.getElementById("foodCategory").addEventListener("change", async (e) => {
  const category = e.target.value;
  if (!category) {
    renderFoodPage(currentFoodPage);
    return;
  }
  const meals = await fetchMealsByCategory(category);
  allMeals = meals;
  currentFoodPage = 1;
  renderFoodPage(currentFoodPage);
});

// Sort meals using .sort() HOF
document.getElementById("foodSort").addEventListener("change", (e) => {
  const sort = e.target.value;
  if (!sort) return;

  const sorted = [...allMeals].sort((a, b) => {
    if (sort === "az") return a.strMeal.localeCompare(b.strMeal);
    if (sort === "za") return b.strMeal.localeCompare(a.strMeal);
    return 0;
  });

  allMeals = sorted;
  currentFoodPage = 1;
  renderFoodPage(currentFoodPage);
});

// ===== CLOSE MODAL =====
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("mealModal").classList.add("hidden");
});

// Close modal on outside click
document.getElementById("mealModal").addEventListener("click", (e) => {
  if (e.target === document.getElementById("mealModal")) {
    document.getElementById("mealModal").classList.add("hidden");
  }
});

// ===== INITIALIZE APP =====
async function initApp() {
  // Load theme
  initTheme();

  // Load favorites
  renderFavorites();

  // Load food of the day
  const randomMeal = await fetchRandomMeal();
  if (randomMeal) renderFoodOfDay(randomMeal);

  // Load last searched city
  const lastCity = getLastCity();
  if (lastCity) {
    document.getElementById("citySearch").value = lastCity;
    await searchCity(lastCity);
  }

  // Load default meals
  const defaultMeals = await fetchMealsByCategory("Chicken");
  allMeals = defaultMeals;
  renderFoodPage(currentFoodPage);
}

// Start the app
initApp();