export const setTheme = theme => {
  const dark = theme === 'system' ? matchMedia('(prefers-color-scheme: dark)').matches : theme === 'dark';
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.classList.toggle('light', !dark && theme !== 'system');
  localStorage.setItem('theme', theme);
  document.dispatchEvent(new CustomEvent('theme:change', {detail: {theme, dark}}));
};

export const switchTheme = () => setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');

setTheme(localStorage.getItem('theme') || 'system');
matchMedia('(prefers-color-scheme: dark)').onchange = () => {
  if (localStorage.getItem('theme') === 'system') setTheme('system');
};

document.addEventListener('click', event => {
  const button = event.target.closest('.theme-toggle');
  if (!button) return;
  const update = () => button.value ? setTheme(button.value) : switchTheme();
  document.startViewTransition ? document.startViewTransition(update) : update();
});