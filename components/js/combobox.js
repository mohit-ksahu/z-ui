import {keyNav} from './base.js';

const popover = el => el?.closest('.combobox-popover') ?? document.getElementById(el?.getAttribute('popovertarget') ?? '');

const labelOf = item => item.dataset.label ?? item.lastChild?.textContent?.trim() ?? item.textContent.trim();

const filter = (pop, query) => {
  let count = 0;
  pop.querySelectorAll('.combobox-item').forEach(item => {
    const match = labelOf(item).toLowerCase().includes(query);
    item.classList.toggle('hidden', !match);
    if (!match) item.classList.remove('active');
    else count++;
  });
  pop.querySelectorAll('.combobox-group').forEach(g =>
    g.classList.toggle('hidden', !g.querySelector('.combobox-item:not(.hidden)'))
  );
};

const open = target => {
  const pop = popover(target);
  if (!pop || pop.matches(':popover-open')) return;
  pop.showPopover();
  filter(pop, '');
};

const chip = (wrap, label, add) => {
  if (!wrap) return;
  const match = wrap.querySelector(`.combobox-chip[data-val="${CSS.escape(label)}"]`);
  if (add && !match) {
    const el = document.createElement('span');
    el.className = 'combobox-chip';
    el.dataset.val = label;
    el.innerHTML = `${label}<button class="combobox-chip-remove" tabindex="-1">&times;</button>`;
    wrap.insertBefore(el, wrap.querySelector('.combobox-chip-input'));
  } else if (!add && match) {
    match.remove();
  }
};

const deselect = (pop, val) =>
  pop?.querySelectorAll('.combobox-item.selected').forEach(item => {
    if (labelOf(item) === val) item.classList.remove('selected');
  });

const select = (item, addOnly = false) => {
  const pop = item.closest('.combobox-popover');
  if (!pop) return;
  const wrap = document.querySelector(`[popovertarget="${pop.id}"]`)?.closest('.combobox-chips');
  const label = labelOf(item);

  if (pop.hasAttribute('multiple')) {
    const added = addOnly ? (item.classList.add('selected'), true) : item.classList.toggle('selected');
    chip(wrap, label, added);
  } else {
    pop.querySelectorAll('.combobox-item.selected').forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
    const btnValue = document.querySelector(`button[popovertarget="${pop.id}"] .combobox-value`);
    const trigInput = document.querySelector(`.combobox-input-trigger [popovertarget="${pop.id}"]`);
    if (btnValue) btnValue.textContent = label;
    if (trigInput) trigInput.value = label;
    pop.hidePopover();
  }
};

document.addEventListener('toggle', e => {
  if (e.newState !== 'open' || !e.target.matches('.combobox-popover')) return;
  const input = e.target.querySelector('.combobox-input');
  if (!input) return;
  input.value = '';
  filter(e.target, '');
  input.focus();
}, true);

document.addEventListener('input', e => {
  if (!e.target.matches('.combobox-input, .combobox-chip-input, .combobox-input-trigger .input')) return;
  const pop = popover(e.target);
  if (!pop) return;
  if (!pop.matches(':popover-open')) open(e.target);
  filter(pop, e.target.value.toLowerCase());
});

document.addEventListener('focusin', e => {
  if (e.target.matches('.combobox-input-trigger .input, .combobox-chip-input')) open(e.target);
});

document.addEventListener('focusout', e => {
  if (!e.target.matches('.combobox-input-trigger .input')) return;
  const pop = popover(e.target);
  if (pop) requestAnimationFrame(() => {
    if (!pop.contains(document.activeElement)) pop.hidePopover();
  });
});

document.addEventListener('click', e => {
  document.querySelectorAll('.combobox-popover[multiple]:popover-open').forEach(pop => {
    const wrap = document.querySelector(`[popovertarget="${pop.id}"]`)?.closest('.combobox-chips');
    if (!pop.contains(e.target) && !wrap?.contains(e.target)) pop.hidePopover();
  });

  const item = e.target.closest('.combobox-item');
  if (item) return select(item);

  if (e.target.closest('.combobox-chip-remove')) {
    const el = e.target.closest('.combobox-chip');
    const wrap = el?.closest('.combobox-chips');
    const pop = wrap ? popover(wrap) : null;
    el?.remove();
    deselect(pop, el?.dataset.val);
    return;
  }

  const wrap = e.target.closest('.combobox-chips');
  if (wrap && !e.target.matches('.combobox-chip-input')) {
    wrap.querySelector('.combobox-chip-input')?.focus();
    open(wrap);
  }
});

document.addEventListener('keydown', e => {
  const pop = popover(e.target);

  if (pop?.matches(':popover-open')) {
    const items = [...pop.querySelectorAll('.combobox-item:not(.hidden)')];
    const index = items.findIndex(item => item.classList.contains('active'));

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = keyNav(e, index, items.length, {prevKey: 'ArrowUp', nextKey: 'ArrowDown', homeEnd: true});
      items.forEach((item, n) => item.classList.toggle('active', n === next));
      items[next]?.scrollIntoView({block: 'nearest'});
      return;
    }

    if (e.key === 'Enter' && items.length) {
      e.preventDefault();
      select(index >= 0 ? items[index] : items[0], true);
      if (e.target.matches('.combobox-chip-input')) {
        e.target.value = '';
        filter(pop, '');
      }
      return;
    }
  }

  if (e.target.matches('.combobox-chip-input')) {
    if (e.key === 'Enter' && !pop && e.target.value.trim()) {
      e.preventDefault();
      const el = document.createElement('span');
      el.className = 'combobox-chip';
      el.innerHTML = `${e.target.value.trim()}<button class="combobox-chip-remove" tabindex="-1">&times;</button>`;
      e.target.before(el);
      e.target.value = '';
    } else if (e.key === 'Backspace' && !e.target.value) {
      const wrap = e.target.closest('.combobox-chips');
      const last = wrap?.querySelector('.combobox-chip:last-of-type');
      if (last) {
        deselect(pop ?? popover(wrap), last.dataset.val);
        last.remove();
      }
    }
  }
});