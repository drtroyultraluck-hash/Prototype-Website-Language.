// tourist-japan.js
document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle (persist to localStorage)
  const toggle = document.getElementById('themeToggle');
  const body = document.body;
  const saved = localStorage.getItem('tj_theme') || 'dark';
  if (saved === 'light') body.classList.add('light');

  function updateToggle() {
    toggle.textContent = body.classList.contains('light') ? '☀' : '☾';
  }
  updateToggle();

  toggle.addEventListener('click', () => {
    body.classList.toggle('light');
    localStorage.setItem('tj_theme', body.classList.contains('light') ? 'light' : 'dark');
    updateToggle();
  });

  // Smooth scroll from any # anchor (fallback)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) { e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
      }
    });
  });

  // minor: keyboard accessibility for CTA
  const explore = document.getElementById('exploreBtn');
  if (explore) explore.addEventListener('keyup', (e) => { if (e.key === 'Enter') explore.click(); });
});