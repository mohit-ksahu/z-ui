import {keyNav} from './base.js';

const itemSel = '[role^="menuitem"], .menu-item';

document.addEventListener('toggle', e => {
  const menu = e.target.closest('[popover]');
  if (!menu) return;

  document.querySelector(`[popovertarget="${menu.id}"]`)?.setAttribute('data-state', e.newState);
  if (e.newState !== 'open') return;

  menu.querySelector(itemSel)?.focus();
  const parent = menu.parentElement?.closest('[popover]');
  if (!parent) return;

  parent.querySelectorAll(':scope > [popover]:popover-open').forEach(sibling => {
    if (sibling !== menu) sibling.hidePopover();
  });
}, {capture: true});

document.addEventListener('keydown', e => {
  const target = e.target.closest(itemSel);
  const menu = target?.closest('[popover]');
  if (!menu || !target) return;

  const items = [...menu.querySelectorAll(itemSel)];
  const index = items.indexOf(target);
  if (index < 0) return;

  const nextIndex = keyNav(e, index, items.length, {prevKey: 'ArrowUp', nextKey: 'ArrowDown', homeEnd: true});
  if (nextIndex >= 0) items[nextIndex].focus();

  if (e.key === 'ArrowRight' && target.hasAttribute('popovertarget')) {
    const subMenu = document.getElementById(target.getAttribute('popovertarget'));
    if (subMenu) {
      subMenu.showPopover();
      subMenu.querySelector(itemSel)?.focus();
    }
  } else if (e.key === 'ArrowLeft') {
    const trigger = document.querySelector(`[popovertarget="${menu.id}"]`);
    if (trigger?.closest('[popover]')) {
      menu.hidePopover();
      trigger.focus();
    }
  }
});

document.addEventListener('click', e => {
  const target = e.target.closest('[role="menuitem"]:not([popovertarget])');
  if (!target) return;

  let current = target.closest('[popover]');
  while (current) {
    current.hidePopover();
    current = document.querySelector(`[popovertarget="${current.id}"]`)?.closest('[popover]');
  }
});

document.addEventListener('mouseover', e => {
  const menu = e.target.closest('.dropdown[popover], [role="menu"]');
  if (!menu) return;

  const item = e.target.closest(itemSel);
  const targetId = item?.getAttribute('popovertarget');
  const subMenu = targetId ? document.getElementById(targetId) : null;
  if (subMenu && !subMenu.matches(':popover-open')) subMenu.showPopover();

  menu.querySelectorAll('[popovertarget]').forEach(trigger => {
    if (trigger === item) return;
    const sub = document.getElementById(trigger.getAttribute('popovertarget'));
    if (sub?.matches(':popover-open')) sub.hidePopover();
  });
});
