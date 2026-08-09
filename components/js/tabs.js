import {keyNav} from './base.js';

const tabDisabled = tab => tab.disabled || tab.hasAttribute('disabled') || tab.getAttribute('aria-disabled') === 'true';

const activateTab = tab => {
  if (!tab || tabDisabled(tab)) return;
  const tablist = tab.closest('[role="tablist"]');
  if (!tablist) return;

  tablist.querySelectorAll('[role="tab"]').forEach(item => {
    const active = item === tab;
    const panelId = item.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;

    item.setAttribute('aria-selected', active);
    item.tabIndex = active && !tabDisabled(item) ? 0 : -1;
    if (panel) panel.hidden = !active;
  });
};

document.addEventListener('click', e => {
  const tab = e.target.closest('[role="tab"]');
  if (tab && !tabDisabled(tab)) activateTab(tab);
});

document.addEventListener('keydown', e => {
  const tab = e.target.closest('[role="tab"]');
  if (!tab || tabDisabled(tab)) return;

  const tablist = tab.closest('[role="tablist"]');
  if (!tablist) return;

  const tabs = [...tablist.querySelectorAll('[role="tab"]')].filter(t => !tabDisabled(t));
  const index = tabs.indexOf(tab);
  if (index < 0) return;

  const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
  const nextIndex = keyNav(e, index, tabs.length, {
    prevKey: vertical ? 'ArrowUp' : 'ArrowLeft',
    nextKey: vertical ? 'ArrowDown' : 'ArrowRight',
    homeEnd: true,
  });

  if (nextIndex >= 0) {
    activateTab(tabs[nextIndex]);
    tabs[nextIndex].focus();
  }
});