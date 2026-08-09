import {keyNav} from './base.js';

const queryAll = (selector, container = document) => [...container.querySelectorAll(selector)];

const handleDropdown = e => {
  const menu = e.target.closest('[popover]');
  const target = e.target;
  if (!menu) return;

  if (e.type === 'toggle') {
    const trigger = document.querySelector(`[popovertarget="${menu.id}"]`);
    if (trigger) trigger.setAttribute('data-state', e.newState);

    if (e.newState === 'open') {
      queryAll('[role="menuitem"]', menu)[0]?.focus();
      const parent = menu.parentElement?.closest('[popover]');
      if (parent) {
        parent.querySelectorAll(':scope > [popover]:popover-open').forEach(sibling => {
          if (sibling !== menu) sibling.hidePopover();
        });
      }
    }
  } else if (e.type === 'keydown') {
    const items = queryAll('[role="menuitem"]', menu);
    const index = items.indexOf(target);
    if (index < 0) return;

    const nextIndex = keyNav(e, index, items.length, {prevKey: 'ArrowUp', nextKey: 'ArrowDown', homeEnd: true});
    if (nextIndex >= 0) items[nextIndex].focus();

    const trigger = document.querySelector(`[popovertarget="${menu.id}"]`);
    if (e.key === 'ArrowRight' && target.hasAttribute('popovertarget')) {
      const subMenu = document.getElementById(target.getAttribute('popovertarget'));
      if (subMenu) {
        subMenu.showPopover();
        subMenu.querySelector('[role="menuitem"]')?.focus();
      }
    } else if (e.key === 'ArrowLeft' && trigger?.closest('[popover]')) {
      menu.hidePopover();
      trigger.focus();
    }
  } else if (e.type === 'click' && target.closest('[role="menuitem"]:not([popovertarget])')) {
    let current = menu;
    while (current) {
      current.hidePopover();
      const nextTrigger = document.querySelector(`[popovertarget="${current.id}"]`);
      current = nextTrigger?.closest('[popover]');
    }
  }
};

['keydown', 'click'].forEach(type => {
  document.addEventListener(type, e => {
    if (e.target.closest('[role="menuitem"]')) handleDropdown(e);
  });
});

document.addEventListener('toggle', e => {
  if (e.target.closest('[popover]')) handleDropdown(e);
}, {capture: true});

document.addEventListener('mouseover', e => {
  const item = e.target.closest('[role="menuitem"]');
  if (!item) return;

  const targetId = item.getAttribute('popovertarget');
  const subMenu = targetId ? document.getElementById(targetId) : null;
  if (subMenu && !subMenu.matches(':popover-open')) subMenu.showPopover();

  const menu = item.closest('[popover]');
  if (menu) {
    menu.querySelectorAll('[popovertarget]').forEach(trigger => {
      if (trigger === item) return;
      const subMenu = document.getElementById(trigger.getAttribute('popovertarget'));
      if (subMenu?.matches(':popover-open')) subMenu.hidePopover();
    });
  }
});