// ===== LOKALEE — storage.js =====
// Handles all localStorage operations

// ===== FAVORITES =====

// Get all saved favorite cities
function getFavorites() {
  const favs = localStorage.getItem("lokalee_favorites");
  return favs ? JSON.parse(favs) : [];
}

// Save a city to favorites
function saveFavorite(cityData) {
  const favs = getFavorites();
  // Check if city already saved using .find()
  const exists = favs.find(
    (f) => f.name.toLowerCase() === cityData.name.toLowerCase()
  );
  if (exists) {
    alert(`${cityData.name} is already in your favorites!`);
    return;
  }
  favs.push(cityData);
  localStorage.setItem("lokalee_favorites", JSON.stringify(favs));
  alert(`❤️ ${cityData.name} added to favorites!`);
}

// Remove a city from favorites
function removeFavorite(cityName) {
  const favs = getFavorites();
  // Remove using .filter()
  const updated = favs.filter(
    (f) => f.name.toLowerCase() !== cityName.toLowerCase()
  );
  localStorage.setItem("lokalee_favorites", JSON.stringify(updated));
}

// Check if a city is already in favorites
function isFavorite(cityName) {
  const favs = getFavorites();
  return !!favs.find(
    (f) => f.name.toLowerCase() === cityName.toLowerCase()
  );
}

// ===== DARK MODE =====

// Save theme preference
function saveTheme(theme) {
  localStorage.setItem("lokalee_theme", theme);
}

// Get saved theme preference
function getSavedTheme() {
  return localStorage.getItem("lokalee_theme") || "light";
}

// ===== BACKPACKER CHECKLIST =====

// Save checklist for a city
function saveChecklist(cityName, checklist) {
  localStorage.setItem(
    `lokalee_checklist_${cityName.toLowerCase()}`,
    JSON.stringify(checklist)
  );
}

// Get saved checklist for a city
function getChecklist(cityName) {
  const data = localStorage.getItem(
    `lokalee_checklist_${cityName.toLowerCase()}`
  );
  return data ? JSON.parse(data) : [];
}

// ===== LAST SEARCHED CITY =====

// Save last searched city
function saveLastCity(cityName) {
  localStorage.setItem("lokalee_last_city", cityName);
}

// Get last searched city
function getLastCity() {
  return localStorage.getItem("lokalee_last_city") || "";
}