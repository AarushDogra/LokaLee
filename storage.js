// ===== LOKALEE — storage.js =====
// Only handles theme + last searched city

// ===== THEME =====
function saveTheme(theme) {
  localStorage.setItem("lokalee_theme", theme);
}

function getSavedTheme() {
  return localStorage.getItem("lokalee_theme") || "light";
}

// ===== LAST SEARCHED CITY =====
function saveLastCity(cityName) {
  localStorage.setItem("lokalee_last_city", cityName);
}

function getLastCity() {
  return localStorage.getItem("lokalee_last_city") || "";
}