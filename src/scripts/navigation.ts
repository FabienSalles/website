// Mobile menu
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const menuIconOpen = document.getElementById('menu-icon-open');
const menuIconClose = document.getElementById('menu-icon-close');

mobileMenuButton?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('hidden');
  mobileMenu?.classList.toggle('flex');
  menuIconOpen?.classList.toggle('hidden');
  menuIconClose?.classList.toggle('hidden');
});

// Mega menu formations
const formationsNav = document.getElementById('formations-nav');
const formationsMega = document.getElementById('formations-mega');
const formationsChevron = document.getElementById('formations-chevron');
let hideTimeout: ReturnType<typeof setTimeout>;

function showMega() {
  clearTimeout(hideTimeout);
  formationsMega?.classList.remove('hidden');
  formationsChevron?.classList.add('rotate-180');
}

function hideMega() {
  hideTimeout = setTimeout(() => {
    formationsMega?.classList.add('hidden');
    formationsChevron?.classList.remove('rotate-180');
  }, 150);
}

formationsNav?.addEventListener('mouseenter', showMega);
formationsNav?.addEventListener('mouseleave', hideMega);
formationsMega?.addEventListener('mouseenter', showMega);
formationsMega?.addEventListener('mouseleave', hideMega);

// Theme toggle
function updateThemeIcons(theme: string) {
  document.querySelectorAll('.theme-icon-sun').forEach(el => el.classList.toggle('hidden', theme === 'dark'));
  document.querySelectorAll('.theme-icon-moon').forEach(el => el.classList.toggle('hidden', theme === 'light'));
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', next);
  updateThemeIcons(next);
}

updateThemeIcons(document.documentElement.getAttribute('data-theme') || 'light');

document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggleTheme);
