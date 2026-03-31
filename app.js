/* =============================================
   LOKALEE — Landing Page Scripts
   (Loaded as classic JS in index.html)
   ============================================= */

// All logic is inlined in index.html for simplicity,
// but this file is reserved for future extensions.

// ── Preloader (optional) ──
document.addEventListener('DOMContentLoaded', () => {
  // Remove preloader if exists
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => preloader.remove(), 500);
    }, 800);
  }
});
