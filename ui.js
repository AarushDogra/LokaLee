// ===== LOKALEE — ui.js =====
// Handles all DOM rendering functions

// ===== RENDER WEATHER CARD =====
function renderWeather(data) {
  const card = document.getElementById("weatherCard");
  const content = document.getElementById("weatherContent");
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  content.innerHTML = `
    <div class="weather-info">
      <img src="${icon}" alt="${data.weather[0].description}" />
      <div>
        <h2>${data.name}, ${data.sys.country}</h2>
        <h3>${Math.round(data.main.temp)}°C</h3>
        <p>${data.weather[0].description}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>💨 Wind: ${data.wind.speed} m/s</p>
        <p>🌡️ Feels like: ${Math.round(data.main.feels_like)}°C</p>
      </div>
      <button class="btn-accent fav-btn" onclick="handleFavorite('${data.name}', '${data.sys.country}', ${Math.round(data.main.temp)}, '${data.weather[0].description}')">
        ${isFavorite(data.name) ? "❤️ Saved" : "🤍 Save City"}
      </button>
    </div>
  `;
  card.classList.remove("hidden");
}

// ===== RENDER COUNTRY CARD =====
function renderCountry(data) {
  const card = document.getElementById("countryCard");
  const content = document.getElementById("countryContent");

  const currency = Object.values(data.currencies || {})[0];
  const languages = Object.values(data.languages || {}).join(", ");

  content.innerHTML = `
    <div class="country-info">
      <img src="${data.flags.png}" alt="${data.name.common} flag" />
      <div>
        <h2>${data.name.common}</h2>
        <p>🏙️ Capital: ${data.capital?.[0] || "N/A"}</p>
        <p>💱 Currency: ${currency?.name || "N/A"} (${currency?.symbol || ""})</p>
        <p>🗣️ Language: ${languages || "N/A"}</p>
        <p>👥 Population: ${data.population.toLocaleString()}</p>
        <p>🌍 Region: ${data.region}</p>
      </div>
    </div>
  `;
  card.classList.remove("hidden");
}

// ===== RENDER FOOD OF THE DAY =====
function renderFoodOfDay(meal) {
  const content = document.getElementById("foodOfDayContent");
  content.innerHTML = `
    <div class="weather-info">
      <img src="${meal.strMealThumb}/preview" alt="${meal.strMeal}"
        style="width:100px; height:100px; border-radius:12px; object-fit:cover;"/>
      <div>
        <h2>${meal.strMeal}</h2>
        <p>🍽️ Category: ${meal.strCategory}</p>
        <p>🌍 Cuisine: ${meal.strArea}</p>
        <button class="btn-primary" style="margin-top:0.5rem"
          onclick="openMealModal('${meal.idMeal}')">
          View Recipe
        </button>
      </div>
    </div>
  `;
}

// ===== RENDER FOOD GRID =====
function renderFoodGrid(meals) {
  const grid = document.getElementById("foodGrid");
  if (!meals || meals.length === 0) {
    grid.innerHTML = `<p style="color:var(--subtext)">No meals found.</p>`;
    return;
  }

  grid.innerHTML = meals.map((meal) => `
    <div class="grid-card">
      <img src="${meal.strMealThumb}/preview" alt="${meal.strMeal}" />
      <div class="grid-card-body">
        <h3>${meal.strMeal}</h3>
        <p>${meal.strCategory || ""} ${meal.strArea ? "• " + meal.strArea : ""}</p>
        <button class="btn-primary" style="margin-top:0.8rem; width:100%"
          onclick="openMealModal('${meal.idMeal}')">
          View Recipe
        </button>
      </div>
    </div>
  `).join("");
}

// ===== RENDER MEAL MODAL =====
async function openMealModal(mealId) {
  const meal = await fetchMealDetails(mealId);
  if (!meal) return;

  const modal = document.getElementById("mealModal");
  const body = document.getElementById("modalBody");

  // Get ingredients using map + filter
  const ingredients = Array.from({ length: 20 }, (_, i) => i + 1)
    .map((i) => ({
      ingredient: meal[`strIngredient${i}`],
      measure: meal[`strMeasure${i}`],
    }))
    .filter((item) => item.ingredient && item.ingredient.trim() !== "");

  body.innerHTML = `
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"
      style="width:100%; border-radius:12px; margin-bottom:1rem;"/>
    <h2 style="color:var(--primary); margin-bottom:0.5rem">${meal.strMeal}</h2>
    <p style="color:var(--subtext); margin-bottom:1rem">
      🍽️ ${meal.strCategory} &nbsp;|&nbsp; 🌍 ${meal.strArea}
    </p>
    <h3 style="margin-bottom:0.5rem">🧂 Ingredients</h3>
    <ul style="margin-bottom:1rem; padding-left:1.2rem; color:var(--subtext)">
      ${ingredients.map((i) => `<li>${i.measure} ${i.ingredient}</li>`).join("")}
    </ul>
    <h3 style="margin-bottom:0.5rem">📋 Instructions</h3>
    <p style="color:var(--subtext); line-height:1.7; font-size:0.9rem">
      ${meal.strInstructions}
    </p>
    ${meal.strYoutube ? `
      <a href="${meal.strYoutube}" target="_blank"
        style="display:inline-block; margin-top:1rem;"
        class="btn-accent">▶️ Watch on YouTube</a>
    ` : ""}
  `;

  modal.classList.remove("hidden");
}

// ===== RENDER COMPARE CARDS =====
function renderCompareCards(results) {
  const grid = document.getElementById("compareResult");
  grid.innerHTML = results.map((r) => `
    <div class="compare-card">
      <h2>🌍 ${r.city}</h2>
      <p>🌡️ Temperature: ${r.temp}°C</p>
      <p>🌤️ Weather: ${r.weather}</p>
      <p>💧 Humidity: ${r.humidity}%</p>
      <p>🏛️ Attractions: ${r.attractions} found</p>
      <p>🌍 Country: ${r.country}</p>
    </div>
  `).join("");
}

// ===== RENDER BUDGET RESULT =====
function renderBudgetResult(budget, days, rates, currency) {
  const result = document.getElementById("budgetResult");
  const daily = (budget / days).toFixed(2);
  const converted = rates ? (daily * (rates[currency] || 1)).toFixed(2) : daily;

  result.innerHTML = `
    <h3 style="color:var(--primary); margin-bottom:1rem">💰 Budget Breakdown</h3>
    <p>📅 Total Days: <strong>${days}</strong></p>
    <p>💵 Daily Budget (USD): <strong>$${daily}</strong></p>
    <p>💱 Daily Budget (${currency}): <strong>${converted} ${currency}</strong></p>
    <p style="margin-top:0.8rem; color:var(--subtext); font-size:0.9rem">
      💡 Tip: Budget travelers usually spend $30–50/day. Mid-range is $80–150/day.
    </p>
  `;
  result.classList.remove("hidden");
}

// ===== RENDER BACKPACKER GUIDE =====
function renderGuide(weatherData, countryData) {
  const guide = document.getElementById("guideContent");
  const temp = Math.round(weatherData.main.temp);
  const condition = weatherData.weather[0].main;
  const currency = Object.values(countryData?.currencies || {})[0];
  const language = Object.values(countryData?.languages || {}).join(", ");

  // Auto checklist based on weather
  const checklist = [
    "✅ Valid passport and visa documents",
    "✅ Travel insurance",
    "✅ Local currency or card",
    temp < 10 ? "🧥 Pack warm clothes and thermals" : "",
    temp > 30 ? "🕶️ Sunscreen, sunglasses, light clothes" : "",
    condition === "Rain" ? "☔ Bring a raincoat or umbrella" : "",
    condition === "Snow" ? "❄️ Waterproof boots and heavy jacket" : "",
    "📱 Download offline maps (Google Maps)",
    "🏥 Know the nearest hospital location",
    "🔌 Check plug adapter requirements",
  ].filter((item) => item !== "");

  // Save checklist to localStorage
  saveChecklist(weatherData.name, checklist);

  guide.innerHTML = `
    <h3 style="color:var(--primary); margin-bottom:1rem">
      🎒 Survival Guide — ${weatherData.name}
    </h3>
    <div style="margin-bottom:1rem">
      <p>💱 Local Currency: <strong>${currency?.name || "N/A"} (${currency?.symbol || ""})</strong></p>
      <p>🗣️ Language: <strong>${language || "N/A"}</strong></p>
      <p>🌡️ Current Temp: <strong>${temp}°C</strong></p>
      <p>🌤️ Condition: <strong>${condition}</strong></p>
    </div>
    <h4 style="margin-bottom:0.8rem">📋 Packing Checklist</h4>
    <ul style="padding-left:1.2rem; color:var(--subtext); line-height:2">
      ${checklist.map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <p style="margin-top:1rem; font-size:0.85rem; color:var(--subtext)">
      ✅ Checklist saved automatically!
    </p>
  `;
}

// ===== RENDER FAVORITES =====
function renderFavorites() {
  const grid = document.getElementById("favoritesGrid");
  const favs = getFavorites();

  if (favs.length === 0) {
    grid.innerHTML = `<p style="color:var(--subtext)">No favorites saved yet. Search a city and save it!</p>`;
    return;
  }

  grid.innerHTML = favs.map((f) => `
    <div class="grid-card">
      <div class="grid-card-body">
        <h3>🌍 ${f.name}, ${f.country}</h3>
        <p>🌡️ ${f.temp}°C — ${f.description}</p>
        <button class="btn-accent" style="margin-top:0.8rem; width:100%"
          onclick="removeFavoriteAndRefresh('${f.name}')">
          ❌ Remove
        </button>
      </div>
    </div>
  `).join("");
}

// ===== PAGINATION HELPER =====
function paginate(items, page, perPage = 8) {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

function renderPagination(totalItems, currentPage, perPage, onPageClick) {
  const pagination = document.getElementById("foodPagination");
  const totalPages = Math.ceil(totalItems / perPage);

  pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map((page) => `
      <button class="${page === currentPage ? "active" : ""}"
        onclick="${onPageClick}(${page})">
        ${page}
      </button>
    `).join("");
}